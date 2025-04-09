<?php

use Illuminate\Support\Facades\Route;

// Main SPA entry point - catches all routes not explicitly defined
Route::get('/{any?}', function () {
    return view('spa');
})->where('any', '.*');