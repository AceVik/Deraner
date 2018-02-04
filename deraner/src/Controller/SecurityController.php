<?php

namespace App\Controller;

use Deraner\Controller\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

/**
 * Class SecurityController
 *
 * @Route("/security")
 *
 * @package App\Controller
 */
class SecurityController extends Controller {
    /**
     * @Route("/login", name="security_login")
     */
    public function login(Request $rq, AuthenticationUtils $authUtils) {

        $errors = $authUtils->getLastAuthenticationError();
        $username = $authUtils->getLastUsername();

        $rspErrors = [];

        if($errors) {
            foreach($errors as &$error) {
                /**
                 * @var AuthenticationException $error
                 */

                $rspErrors[] = [
                    'errorKey' => $error->getMessageKey(),
                    'errorMessage' => $error->getMessage()
                ];
            }
        }

        return JsonResponse::create([
            'status' => -1,
            'errors' => $rspErrors,
            'username' => $username
        ]);
    }

    /**
     * @Route("/success", name="security_success")
     */
    public function success(Request $rq) {
        $user = $this->getUser();

        return JsonResponse::create([
            'status' => 1,
            'username' => $user->getUsername(),
            'mail' => $user->getMail()
        ]);
    }
}