<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints\Email;

use Knp\Component\Pager\PaginatorInterface;

use App\Entity\User;
use App\Entity\Video;
use App\Services\JwtAuth;

class VideoController extends AbstractController
{    
    
    private function restJson($data) {
        // Serializar datos con servicio de serializar
        $json = $this->get('serializer')->serialize($data,'json');
        
        // Response con httpfoundation
        $response = new Response();
        
        // Asignar contenido a la respuesta
        $response->setContent($json);
        
        // Indicar formato de respuesta
        $response->headers->set('Content-Type','application/json');
        
        // Devolver la respuesta
        return $response;
    }
    
    public function index(): Response
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/VideoController.php',
        ]);
    }
    
    public function create(Request $request, JwtAuth $jwt_auth, $id = null){
        
        // Recoger el token
        $token = $request->headers->get('Authorization', null);
        
        // Comprobar si es correcto
        $authCheck = $jwt_auth->checkToken($token);
        
        // Mensaje por defecto
        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'El video no se ha guardado'            
        ];
        
        if($authCheck){
            
            // Recoger datos por POST
            $json = $request->get('json', null);
            $params = json_decode($json);
        
            // Recoger el objeto del usuario identificado
            $identity = $jwt_auth->checkToken($token, true);

            // Comprobar y validar datos
            if(!empty($json)){
                $user_id = ($identity->sub != null) ? $identity->sub : null;
                $title = (!empty($params->title)) ? $params->title : null;
                $description = (!empty($params->description)) ? $params->description : null;
                $url = (!empty($params->url)) ? $params->url : null;
                
                if(!empty($user_id) && !empty($title)){
                    
                    // Obtener el usuario que va a guardar el video                 
                    $em = $this->getDoctrine()->getManager();
                    $user = $this->getDoctrine()->getRepository(User::class)->findOneBy([
                        'id' => $user_id
                    ]);
                    
                    if($id == null){
                        // Crear y guardar objeto
                        $video = new Video();
                        $video->setUser($user);
                        $video->setTitle($title);
                        $video->setDescription($description);
                        $video->setUrl($url);
                        $video->setStatus('normal');

                        $createdAt = new \Datetime('now');
                        $updatedAt = new \Datetime('now');                    
                        $video->setCreatedAt($createdAt);
                        $video->setUpdatedAt($updatedAt);

                        // Guardar el nuevo video favorito en la BD
                        $em->persist($video);
                        $em->flush();

                        $data = [
                            'status' => 'success',
                            'code' => 200,
                            'message' => 'El video se ha guardado',
                            'video' => $video
                        ];    
                    }
                    else{
                        $video = $this->getDoctrine()->getRepository(Video::class)->findOneBy([
                            'id' => $id,
                            'user' => $identity->sub
                        ]);
                        
                        if($video && is_object($video)){                            
                            $video->setTitle($title);
                            $video->setDescription($description);
                            $video->setUrl($url);
                            
                            $updatedAt = new \Datetime('now');  
                            $video->setUpdatedAt($updatedAt);
                            
                            $em->persist($video);
                            $em->flush();
                            
                            $data = [
                                'status' => 'success',
                                'code' => 200,
                                'message' => 'El video se ha actualizado',
                                'video' => $video
                            ]; 
                        }
                    }
                }
            }            
        }   
        // Devolver respuesta
        return $this->restJson($data);
    }
    
    public function videos(Request $request, JwtAuth $jwt_auth, PaginatorInterface $paginator){
        
        // Recoger la cabecera de autenticación
        $token = $request->headers->get('Authorization');
        
        // Comprobar el token
        $authCheck = $jwt_auth->checkToken($token);
        
        $data = array(
            'status' => 'error',
            'code' => 404,
            'Message' => 'No se pueden listar los videos en este momento'
        );
        
        // Si es valido
        if($authCheck){
            // Conseguir la identidad del usuario
            $identity = $jwt_auth->checkToken($token, true);

            $em = $this->getDoctrine()->getManager();
            
            // Hacer una consulta para paginar
            $dql = "SELECT v FROM App\Entity\Video v WHERE  v.user = ($identity->sub) ORDER BY v.id DESC";
            $query = $em->createQuery($dql);
                    
            // Recoger el parametro page de la url
            $page = $request->query->getInt('page', 1);
            $items_per_page = 5;
                    
            // Invocar paginación
            $pagination = $paginator->paginate($query, $page, $items_per_page);
            $total = $pagination->getTotalItemCount();

            // Preparar array de datos para devolver
            $data = array(
                'status' => 'success',
                'code' => 200,
                'total_items_count' => $total,
                'page_actual' => $page,
                'items_per_page' => $items_per_page,
                'total_pages' => ceil($total / $items_per_page),
                'videos' => $pagination,
                'user_id' => $identity->sub                
            );
        }  
        
        // Devolver respuesta
        return $this->restJson($data);
    }
    
    public function video(Request $request, JwtAuth $jwt_auth, $id = null){
        
        // Sacar el token y comprobar que es correcto
        $token = $request->headers->get('Authorization');
        $authCheck = $jwt_auth->checkToken($token);
        
        // Respuesta por defecto
        $data = array(
            'status' => 'error',
            'code' => 404,
            'Message' => 'No se puede obtener el detalle del video'            
        );

        // Si es valido
        if($authCheck){
        
            // Sacar la identidad del usuario
            $identity = $jwt_auth->checkToken($token, true);

            // Sacar el objeto del video en base al id
            $video = $this->getDoctrine()->getRepository(Video::class)->findOneBy([
                'id' => $id                
            ]);            

            // Comprobar si el video existe y es propiedad del usuario identificado
            if($video && is_object($video) && $identity->sub == $video->getUser()->getId()){
                $data = array(
                    'status' => 'success',
                    'code' => 200,
                    'video' => $video                    
                );
            }
        }        
        // Devolver respuesta
        return $this->restJson($data);
    }
    
    public function remove(Request $request, JwtAuth $jwt_auth, $id = null){
        
        // Sacar el token y comprobar que es correcto
        $token = $request->headers->get('Authorization');
        $authCheck = $jwt_auth->checkToken($token);     
                
        // Respuesta por defecto
        $data = array(
            'status' => 'error',
            'code' => 404,
            'Message' => 'No se puede elminar el video'            
        ); 
        
         // Si es valido
        if($authCheck){
            
            // Sacar la identidad del usuario
            $identity = $jwt_auth->checkToken($token, true);
            
            $doctrine = $this->getDoctrine();
            $em = $doctrine->getManager();

            // Sacar el objeto del video en base al id
            $video = $doctrine->getRepository(Video::class)->findOneBy([
                'id' => $id                
            ]); 
            
            //Si existe el video y pertenece al usuario
            if($video && is_object($video) && $identity->sub == $video->getUser()->getId()){
                $em->remove($video);
                $em->flush();
                
                $data = array(
                    'status' => 'success',
                    'code' => 200,
                    'video' => $video           
                ); 
            }            
        }
        
        // Devolver respuesta
        return $this->restJson($data);        
    }
}
