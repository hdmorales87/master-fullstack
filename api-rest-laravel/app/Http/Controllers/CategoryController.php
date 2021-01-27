<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Category;

class CategoryController extends Controller
{
	public function __construct(){
		$this->middleware('api.auth',['except' => ['index','show']]);
	}

    public function index(){
    	$categories = Category::all();

    	return response()->json([
    		'code' => 200,
    		'status' => 'success',
    		'categories' => $categories
    	]);
    }

    public function show($id){
    	$category = Category::find($id);

    	if(is_object($category)){
    		$data = array(
	    		'code' => 200,
	    		'status' => 'success',
	    		'category' => $category
	    	);
    	}
    	else{
    		$data = array(
	    		'code' => 404,
	    		'status' => 'error',
	    		'message' => 'La categoria no existe'
	    	);
    	}

    	return response()->json($data,$data['code']);    	
    }

    public function store(Request $request){
    	//Recoger los datos por POST
    	$json = $request->input('json',null);
    	$params_array = json_decode($json,true);

    	if(!empty($params_array)){
            //Validar los datos
        	$validate = \Validator::make($params_array,[
    			'name' => 'required',			
        	]);


            if($validate->fails()){
                //la validación ha fallado
                $data = array(
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'No se ha guardado la categoria',
                    'errors' => $validate->errors()
                );          
            }
            else{
                //Guardar la categoria
                $category = new Category();
                $category->name = $params_array['name'];
                $category->save();

                $data = array(
                    'status' => 'success',
                    'code' => 200,                
                    'category' => $category
                ); 
            }
        }
        else{
            $data = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'No se ha enviado ninguna categoria',
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
                'name' => 'required',           
            ]);

            if($validate->fails()){
                //la validación ha fallado
                $data = array(
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'No se ha actualizado la categoria',
                    'errors' => $validate->errors()
                );          
            }
            else{
                //Quitar lo que no quiero actualizar
                unset($params_array['id']);
                unset($params_array['created_at']);
                
                //Actualizar el registro(categoria)
                $category = Category::where('id',$id)->update($params_array);

                $data = array(
                    'status' => 'success',
                    'code' => 200,
                    'category' => $params_array,
                );        
            }
        }
        else{
            $data = array(
                'status' => 'error',
                'code' => 400,
                'message' => 'No se ha enviado ninguna categoria',
            ); 
        }         

        //Devolver respuesta
        return response()->json($data,$data['code']); 
    }
}
