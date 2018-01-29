<?php

namespace Deraner\Controller;

use Deraner\Entity\Template;
use Deraner\Entity\User;
use Deraner\Repository\TemplateRepository;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\HttpFoundation\Response;

/**
 * Deraner controller base
 *
 * @author	Viktor Machnik <viktor@machnik.online>
 * @license	Mozilla Public License 2.0 <https://www.mozilla.org/media/MPL/2.0/index.txt>
 * @package Deraner\Controller
 */
abstract class Controller implements ContainerAwareInterface {
    use ContainerAwareTrait;

    /**
     * @inheritdoc
     */
    protected function getParameter(string $name)
    {
        return $this->container->getParameter($name);
    }

    protected function serve($fileName) : Response {
        $template = $this->getTemplate();

        $filePath = $this->getProjectDir() . '/public/templates/' . $template->getName() . '/' . $fileName . '.html';

        if(!file_exists($filePath) || !is_file($filePath)) {
            //TODO: Throw file not found exception.
        }

        if(!is_readable($filePath)) {
            //TODO: Throw new access denied exception.
        }

        return Response::create(file_get_contents($filePath));

//        TODO: Make it cached.
//        $time = filetime($filePath);
//
//        $key = md5($filePath . $time);
//
//        $content = null;
//
//        $cache = $this->getCache();
//
//        if($cache->hasItem($key)) {
//            $content = $cache->getItem($key);
//        } else {
//            $content = file_get_contents($filePath);
//            $item = CacheItem::
//        }
    }
/*
    public function getCache() : AbstractAdapter {
        //TODO: Auto choose cache.
        static $redisAdapter = null;

        if(is_null($redisAdapter)) {
            $redisAdapter = RedisAdapter::createConnection($this->getParameter('framework.cache.default_redis_provider'));
        }

        return $redisAdapter;
    }*/

    public function getTemplate() : Template {
        $user = $this->getUser();

        if(is_null($user)) {
            /**
             * @var TemplateRepository
             */
            $templateRepository = $this->getDoctrine()->getRepository(Template::class);

            return $templateRepository->getTemplateByName('Ulmenstein');
        }

        return $user->getTemplate();
    }

    /**
     * Gets the application root dir (path of the project's composer file).
     *
     * @return string The project root dir
     */
    protected function getProjectDir()
    {
        static $projectDir = null;
        if(is_null($projectDir)) {
            $r = new \ReflectionObject($this);
            $dir = $rootDir = dirname($r->getFileName());
            while (!file_exists($dir.'/composer.json')) {
                if ($dir === dirname($dir)) {
                    return $projectDir = $rootDir;
                }
                $dir = dirname($dir);
            }
            $projectDir = $dir;
        }

        return $projectDir;
    }

    /**
     * Return the Doctrine Registry service.
     *
     * @return ManagerRegistry
     * @throws \LogicException If Doctrine is not available
     */
    protected function getDoctrine(): ManagerRegistry {
        if (!$this->container->has('doctrine')) {
            throw new \LogicException('The DoctrineBundle is not registered in your application. Try running "composer require symfony/orm-pack".');
        }

        return $this->container->get('doctrine');
    }

    /**
     * Get a user from the Security Token Storage.
     *
     * @return User|null
     * @throws \LogicException If SecurityBundle is not available
     */
    protected function getUser() {
        if (!$this->container->has('security.token_storage')) {
            throw new \LogicException('The SecurityBundle is not registered in your application. Try running "composer require symfony/security-bundle".');
        }

        if (null === $token = $this->container->get('security.token_storage')->getToken()) {
            return null;
        }

        if (!is_object($user = $token->getUser())) {
            // e.g. anonymous authentication
            return null;
        }

        return $user;
    }

    /**
     * Checks the validity of a CSRF token.
     *
     * @param string $id        The id used when generating the token
     * @param string $token     The actual token sent with the request that should be validated
     * @return bool
     * @throws \LogicException If CSRF protection is not enabled.
     */
    protected function isCsrfTokenValid(string $id, string $token): bool
    {
        if (!$this->container->has('security.csrf.token_manager')) {
            throw new \LogicException('CSRF protection is not enabled in your application. Enable it with the "csrf_protection" key in "config/packages/framework.yaml".');
        }

        return $this->container->get('security.csrf.token_manager')->isTokenValid(new CsrfToken($id, $token));
    }

}