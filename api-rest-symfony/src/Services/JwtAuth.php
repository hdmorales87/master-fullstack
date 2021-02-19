<?php

namespace App\Services;

use Firebase\JWT\JWT;
use App\Entity\User;

class JwtAuth{
    
    public $manager;
    public $key;
    
    public function __construct($manager) {
        $this->manager = $manager;
        $this->key = 'clave_secreta1113624878';
    }
    
    public function signup($email, $password, $getToken=null){
        // Comprobar si el usuario existe
        $user = $this->manager->getRepository(User::class)->findOneBy([
            'email' => $email,
            'password' => $password
        ]);        
        
        $signup = false;
        if(is_object($user)){
            $signup = true;
        }
        
        // Si existe, generar el token de jwt
        if($signup){
            $token = [
                'sub' => $user->getId(),
                'name' => $user->getName(),
                'surname' => $user->getSurname(),
                'email' => $user->getEmail(),
                'iat' => time(),
                'exp' => time() + (7 * 24 * 60 * 60)                
            ];      
            
            // Comprobar el flag getToken, condición
            $jwt = JWT::encode($token, $this->key, 'HS256');
            
            if($getToken){                
                $data = $jwt;
            }
            else{
                $decoded = JWT::decode($jwt, $this->key, ['HS256']);
                $data = $decoded;
            }            
        }
        else{
            $data = [
                'status' => 'error',
                'code' => 200,
                'message' => 'Login Incorrecto'
            ];
        }
        
        // Devolver datos
        return $data;
    }   
    
    public function checkToken($jwt, $identity = false){  
        try{
            $decoded = JWT::decode($jwt, $this->key, ['HS256']); 
            if(isset($decoded) && !empty($decoded) && is_object($decoded) && isset($decoded->sub)){
                $auth = true;
            }
            else{
                $auth = false;
            }
            // Debe enviarse el objecto del usuario
            if($identity != false){
                return $decoded;
            }
            else{
                return $auth;
            }
        }
        catch (\UnexpectedValueException $e){
            return false;
        }
        catch (\DomainException $e){
            return false;
        }
    }
}