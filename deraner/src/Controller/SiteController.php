<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SiteController extends BaseController {

    /**
    * @Route("/", name="index")
    */
    public function index(Request $rq) {
        return BinaryFileResponse::create(__DIR__ . '/../../public/templates/' . static::getCurrentTemplate() . '/index.html');
    }
}