<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

abstract class BaseController extends Controller {
    const DefaultTemplate = 'Ulmenstein';

    public static function getCurrentTemplate() {
        return static::DefaultTemplate;
    }
}