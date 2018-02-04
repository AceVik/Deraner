<?php

namespace App\DataFixtures\ORM;

use Deraner\Entity\Template;
use Deraner\Entity\User;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;

class LoadTemplateData implements FixtureInterface, ContainerAwareInterface {
    use ContainerAwareTrait;

    /**
     * Load data fixtures with the passed EntityManager
     *
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager) {

        $template = new Template('Ulmenstein');

        $manager->persist($template);
        $manager->flush();
    }
}