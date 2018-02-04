<?php

namespace App\Controller;

use Deraner\Controller\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SiteController extends Controller {

    /**
    * @Route("/", name="index")
    */
    public function index(Request $rq) {
        return $this->serve('index');

        $user = $this->getUser();
    }
}