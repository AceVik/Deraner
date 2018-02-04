<?php

namespace Deraner\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

use Deraner\Entity\User;

/**
 * Class UserRepository
 * @author	Viktor Machnik <viktor@machnik.online>
 * @license	Mozilla Public License 2.0 <https://www.mozilla.org/media/MPL/2.0/index.txt>
 * @package Deraner\Repository
 */
class UserRepository  extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry) {
        parent::__construct($registry, User::class);
    }

    public function findOneByUsername($username) {
        return $this->findOneBy([
            User::Mail => $username
        ]);
    }
}
