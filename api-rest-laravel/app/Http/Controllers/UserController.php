<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\User;

class UserController extends Controller
{    

    public function register(Request $request){

    	//Recoger los datos del usuario
    	$json = $request->input('json',null);
    	$params = json_decode($json);
    	$params_array = json_decode($json,true);  

    	if(!empty($params) && !empty($params_array)){
	    	//Limpiar datos 
	    	$params_array = array_map('trim',$params_array);	

	    	//Validar datos
	    	$validate = \Validator::make($params_array,[
				'name'     => 'required|alpha',
				'surname'  => 'required|alpha',
				'email'    => 'required|email|unique:users',//Comprobar si usuario existe (Duplicado)
				'password' => 'required',
	    	]);

	    	if($validate->fails()){
	    		//la validación ha fallado
	    		$data = array(
		    		'status' => 'error',
		    		'code' => 404,
		    		'message' => 'El usuario no se ha creado correctamente',
		    		'errors' => $validate->errors()
		    	);    		
	    	}
	    	else{
	    		//validación pasada correctamente

	    		//Cifrar contraseña
	    		$pwd = hash('sha256',$params->password);

    			//Crear usuario
    			$user = new User();
    			$user->name = $params_array['name'];
    			$user->surname = $params_array['surname'];
    			$user->email = $params_array['email'];
    			$user->password = $pwd;
    			$user->role = 'ROLE_USER';

    			//Guardar el usuario
    			$user->save();

	    		$data = array(
		    		'status' => 'success',
		    		'code' => 200,
		    		'message' => 'El usuario se ha creado correctamente',
		    		'user' => $user	    		
		    	);
	    	}
	    }
	    else{
	    	$data = array(
	    		'status' => 'error',
	    		'code' => 404,
	    		'message' => 'Los datos enviados no son correctos',
	    	); 
	    } 

    	return response()->json($data,$data['code']);
    }

    public function login(Request $request){

    	$jwtAuth = new \JwtAuth();

    	//Recibir datos por POST
    	$json = $request->input('json',null);
    	$params = json_decode($json);
    	$params_array = json_decode($json,true);

    	if(!empty($params) && !empty($params_array)){
	    	//Validar los datos
	    	$validate = \Validator::make($params_array,[			
				'email'    => 'required|email',//Comprobar si usuario existe (Duplicado)
				'password' => 'required',
	    	]);

	    	if($validate->fails()){
	    		//la validación ha fallado
	    		$signup = array(
		    		'status' => 'error',
		    		'code' => 404,
		    		'message' => 'El usuario no se ha podido identificar',
		    		'errors' => $validate->errors()
		    	);    		
	    	}
	    	else{
	    		//Cifrar el Password
	    		$pwd = hash('sha256',$params->password);

	    		//Devolver Token o Datos
	    		$signup = $jwtAuth->signup($params->email,$pwd);
	    		if(!empty($params->getToken)){
	    			$signup = $jwtAuth->signup($params->email,$pwd,true);
	    		}
	    	}
	    }
	    else{
	    	$signup = array(
	    		'status' => 'error',
	    		'code' => 404,
	    		'message' => 'Los datos enviados no son correctos',
	    	); 
	    }    	

    	return response()->json($signup,200);
    }

    public function update(Request $request){
    	
    	//Comprobar si el usuario está autorizado
    	$token = $request->header('Authorization');
    	$jwtAuth = new \JwtAuth();
    	$checkToken = $jwtAuth->checkToken($token);    	

    	if($checkToken){ 

    		//Recoger los datos por POST
			$json = $request->input('json',null);    		
			$params_array = json_decode($json,true);

			if(!empty($params_array)){
	    		//Sacar usuario identificado
	    		$user = $jwtAuth->checkToken($token,true);   		

	    		//Validar los datos 
	    		$validate = \Validator::make($params_array,[
					'name'     => 'required|alpha',
					'surname'  => 'required|alpha',
					'email'    => 'required|email|unique:users,email,'.$user->sub,//Comprobar si usuario existe (Duplicado)				
		    	]);

		    	if($validate->fails()){
		    		//la validación ha fallado
		    		$signup = array(
			    		'status' => 'error',
			    		'code' => 404,
			    		'message' => 'El usuario no se ha actualizado correctamente',
			    		'errors' => $validate->errors()
			    	);    		
		    	}
		    	else{
		    		//Quitar los campos que no quiero actualizar
		    		unset($params_array['id']);
		    		unset($params_array['role']);
		    		unset($params_array['password']);
		    		unset($params_array['created_at']);
		    		unset($params_array['remember_token']);

		    		//Actualizar usuario en bd
		    		$user_update = User::where('id',$user->sub)->update($params_array);

		    		//Devolver array con resultado 
		    		$data = array(
			    		'status' => 'success',
			    		'code' => 200,
			    		'user' => $user,
			    		'changes' => $params_array 
			    	);
			    }
		    }
		    else{
		    	$data = array(
		    		'status' => 'error',
		    		'code' => 404,
		    		'message' => 'Los datos enviados no son correctos',
		    	); 
		    } 
    	}
    	else{
    		$data = array(
	    		'status' => 'error',
	    		'code' => 400,
	    		'message' => 'El usuario no está identificado',
	    	); 
    	}
    	
    	return response()->json($data,$data['code']);
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
    		\Storage::disk('users')->put($image_name,\File::get($image));

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
    	$isset = \Storage::disk('users')->exists($filename);
    	if($isset){
    		//Conseguir la imagen
    		$file = \Storage::disk('users')->get($filename);
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

    public function detail($id){
    	$user = User::find($id);

    	if(is_object($user)){
    		$data = array(
	    		'status' => 'success',
	    		'code'   => 200,
	    		'user'   => $user,
	    	);
    	}
    	else{
    		$data = array(
				'status'  => 'error',
				'code'    => 404,
				'message' => 'El usuario no existe',
	    	);    		
    	}
    	return response()->json($data,$data['code']);
    }
}