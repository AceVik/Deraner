<?php

namespace Deraner\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

use Deraner\Entity\Template;

/**
 * Class TemplateRepository
 * @author	Viktor Machnik <viktor@machnik.online>
 * @license	Mozilla Public License 2.0 <https://www.mozilla.org/media/MPL/2.0/index.txt>
 * @package Deraner\Repository
 */
class TemplateRepository  extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry) {
        parent::__construct($registry, Template::class);
    }

    public function getTemplateByName(string $name) : Template {
        return $this->findOneBy([
            Template::Name => $name
        ]);
    }
}
