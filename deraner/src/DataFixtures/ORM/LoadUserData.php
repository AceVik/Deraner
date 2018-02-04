<?php

namespace App\DataFixtures\ORM;

use Deraner\Entity\User;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;

class LoadUserData implements FixtureInterface, ContainerAwareInterface {
    use ContainerAwareTrait;

    /**
     * Load data fixtures with the passed EntityManager
     *
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager) {
        $encoder = $this->container->get('security.password_encoder');

        $mail = 'dev@deraner.de';
        $user = User::create($mail, null);

        $pass = $encoder->encodePassword($user, 'qwer66');
        $user->setPassword($pass);

        $manager->persist($user);
        $manager->flush();
    }
}