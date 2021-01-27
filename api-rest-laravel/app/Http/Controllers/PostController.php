<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Post;
use App\Helpers\JwtAuth;

class PostController extends Controller
{
    public function __construct(){
		$this->middleware('api.auth',['except' => [
			'index',
			'show',
			'getImage',
			'getPostsByCategory',
			'getPostsByUser'
		]]);
	}

	public function index(){
		//load me trae la informacion vinculada de otra tabla(Join)
    	$posts = Post::all()->load('category')->load('user');

    	return response()->json([
    		'code' => 200,
    		'status' => 'success',
    		'posts' => $posts
    	]);
    }

    public function show($id){
    	$post = Post::find($id)->load('category')->load('user');

    	if(is_object($post)){
    		$data = array(
	    		'code' => 200,
	    		'status' => 'success',
	    		'post' => $post
	    	);
    	}
    	else{
    		$data = array(
	    		'code' => 404,
	    		'status' => 'error',
	    		'message' => 'La entrada no existe'
	    	);
    	}

    	return response()->json($data,$data['code']);    	
    }

    public function store(Request $request){
    	//Recoger los datos por POST
    	$json = $request->input('json',null);
    	$params = json_decode($json);
    	$params_array = json_decode($json,true);

    	if(!empty($params_array)){
    		//Conseguir usuario identificado    		
			$user = $this->getIdentity($request);

            //Validar los datos
        	$validate = \Validator::make($params_array,[
    			'title' => 'required',	
    			'content' => 'required',
    			'category_id' => 'required',
    			'image' => 'required',
        	]);

            if($validate->fails()){
                //la validación ha fallado
                $data = array(
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'No se ha guardado el post, faltan datos',
                    'errors' => $validate->errors()
                );          
            }
            else{
                //Guardar la categoria
                $post = new Post();
                $post->user_id = $user->sub;
                $post->category_id = $params_array['category_id'];
                $post->title = $params_array['title'];
                $post->content = $params_array['content'];
                $post->image = $params_array['image'];
                $post->save();

                $data = array(
	                'status' => 'success',
	                'code' => 200,
	                'post' => $post,                
	            );
            }
        }
        else{
            $data = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'Envía los datos correctamente',                
            );  
        } 

    	//Devolver resultado
        return response()->json($data,$data['code']);    	
    }

    public function update($id,Request $request){
        //Recoger datos por PUT
        $json = $request->input('json',null);
        $params_array = json_decode($json,true);

        //Validar que no sea nulo
        if(!empty($params_array)){
            //Validar los datos
            $validate = \Validator::make($params_array,[
               	'title' => 'required',	
    			'content' => 'required',
    			'category_id' => 'required',
    			'image' => 'required',
        	]);

            if($validate->fails()){
                //la validación ha fallado
                $data = array(
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'No se ha actualizado el post',
                    'errors' => $validate->errors()
                );          
            }
            else{
                //Quitar lo que no quiero actualizar
                unset($params_array['id']);
                unset($params_array['user_id']);
                unset($params_array['created_at']);
                unset($params_array['user']);

                //Conseguir usuario identificado
				$user = $this->getIdentity($request);
				
				//Buscar el registro a actualizar
    			$post = Post::where('id',$id)
    						->where('user_id',$user->sub)
    						->first();

				if(!empty($post) && is_object($post)){
			    	//Actualizar el registro en concreto
			    	$post->update($params_array);

			    	//Devolver App
			    	$data = array(
	                    'status' => 'success',
	                    'code' => 200,
	                    'post' => $post,
	                    'changes' => $params_array
	                );
			    }
			    else{
			    	$data = array(
			            'status' => 'success',
			            'code' => 404,
			            'message' => 'Datos Incorrectos'
			        ); 
			    }       
            }
        }
        else{
            $data = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'Datos enviados incorrectamente',
            ); 
        }         

        //Devolver respuesta
        return response()->json($data,$data['code']); 
    }

    public function destroy($id,Request $request){    	
    	//Conseguir usuario identificado
		$user = $this->getIdentity($request);
    	
    	//Conseguir el registro
    	$post = Post::where('id',$id)
    				->where('user_id',$user->sub)
    				->first();

    	if(!empty($post)){
	    	//Borrarlo
	    	$post->delete();

	    	//Devolver App
	    	$data = array(
	            'status' => 'success',
	            'code' => 200,
	            'post' => $post,
	        ); 
	    }
	    else{
	    	$data = array(
	            'status' => 'success',
	            'code' => 404,
	            'message' => 'El post no existe'
	        ); 
	    }

        //Devolver respuesta
        return response()->json($data,$data['code']);
    }

    private function getIdentity($request){
    	$jwtAuth = new JwtAuth();
		$token = $request->header('Authorization',null);
		$user = $jwtAuth->checkToken($token,true);

		return $user;
    }

    public function upload(Request $request){
    	//Recoger datos de la imagen
    	$image = $request->file('file0');

    	//Validación de imagen 
    	$validate = \Validator::make($request->all(),[
			'file0' => 'required|image|mimes:jpg,jpeg,png,gif',					
    	]);

    	//Guardar la imagen
    	if(!$image || $validate->fails()){
    		$msg = 'Error al subir imagen';
    		if( $validate->fails()){
    			$msg = $validate->errors(); 
    		}
    		$data = array(
	    		'status' => 'error',
	    		'code' => 400,
	    		'message' => $msg,
	    	);     		
    	}
    	else{
    		$image_name = time().$image->getClientOriginalName();
    		\Storage::disk('images')->put($image_name,\File::get($image));

    		$data = array(
	    		'status' => 'success',
	    		'code' => 200,
	    		'image' => $image_name
	    	);
    	}

    	return response()->json($data,$data['code']);    	
    }

    public function getImage($filename){
    	//Comprobar si existe el fichero
    	$isset = \Storage::disk('images')->exists($filename);
    	if($isset){
    		//Conseguir la imagen
    		$file = \Storage::disk('images')->get($filename);
    		//Devolver la imagen
    		return new Response($file,200);
    	}
    	else{
    		$data = array(
				'status'  => 'error',
				'code'    => 404,
				'message' => 'La imagen no existe',
	    	);
    		return response()->json($data,$data['code']);
    	} 
    }

    public function getPostsByCategory($id){
    	$posts = Post::where('category_id',$id)->get();

    	return response()->json([
    		'status' => 'success',
    		'posts' => $posts
    	],200);
    }

    public function getPostsByUser($id){
    	$posts = Post::where('user_id',$id)->get();

    	return response()->json([
    		'status' => 'success',
    		'posts' => $posts
    	],200);
    }
}
