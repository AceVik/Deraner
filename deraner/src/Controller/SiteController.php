<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SiteController extends Controller {

    /**
    * @Route("/", name="index")
    */
    public function index(Request $rq) {
        return $this->render('Ulmenstein/sites/index.html.twig');
    }
}