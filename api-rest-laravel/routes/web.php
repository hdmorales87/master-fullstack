<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Http\Middleware\ApiAuthMiddleware;

//RUTAS DE PRUEBA
Route::get('/', function () {
    return view('welcome');
});

Route::get('/pruebas/{nombre?}', function ($texto=null) {
	$texto = '<h2>Texto desde Laravel '.$texto.'</h2>';
    return view('prueba',array(
    	'texto' => $texto
    ));
});

Route::get('/animales', 'PruebaController@index');
Route::get('/test-orm', 'PruebaController@testOrm');

//RUTAS DEL API	

	//Rutas del Controlador de Usuarios
	Route::post('/api/register', 'UserController@register');
	Route::post('/api/login', 'UserController@login');
	Route::put('/api/user/update', 'UserController@update');
	Route::post('/api/user/upload','UserController@upload')->middleware(ApiAuthMiddleware::class);
	Route::get('/api/user/avatar/{filename}','UserController@getImage');
	Route::get('/api/user/detail/{id}','UserController@detail');

	//Rutas del Controlador de Categorias
	Route::resource('/api/category','CategoryController');

	//Rutas del Controlador de Posts
	Route::resource('/api/post','PostController');
	Route::post('/api/post/upload','PostController@upload')->middleware(ApiAuthMiddleware::class);
	Route::get('/api/post/image/{filename}','PostController@getImage');
	Route::get('/api/post/category/{id}','PostController@getPostsByCategory');
	Route::get('/api/post/user/{filename}','PostController@getPostsByUser');