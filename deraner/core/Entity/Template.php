<?php

namespace Deraner\Entity;

use Deraner\Entity\Fields\IdField;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping AS ORM;

/**
 * Template model.
 *
 * @ORM\Entity(repositoryClass="Deraner\Repository\TemplateRepository")
 *
 * @author	Viktor Machnik <viktor@machnik.online>
 * @license	Mozilla Public License 2.0 <https://www.mozilla.org/media/MPL/2.0/index.txt>
 * @package Deraner\Entity
 */
class Template {
    use IdField;

    const Name = 'name';

    /**
     * @var string
     *
     * @ORM\Column(type="string", length="128")
     */
    protected $name;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length="1024")
     */
    protected $path;

    /**
     * @var ArrayCollection<User>
     *
     * @ORM\OneToMany(targetEntity="User", mappedBy="template")
     */
    protected $users;

    public function __construct() {
        $this->users = new ArrayCollection();
    }

    public function getName() {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getPath() {
        return $this->path;
    }
}