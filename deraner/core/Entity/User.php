<?php

namespace Deraner\Entity;

use Deraner\Entity\Fields\IdField;
use Doctrine\ORM\Mapping AS ORM;

/**
 * User model.
 *
 * @ORM\Entity(repositoryClass="Deraner\Repository\UserRepository")
 * @ORM\Table(name="users")
 *
 * @author	Viktor Machnik <viktor@machnik.online>
 * @license	Mozilla Public License 2.0 <https://www.mozilla.org/media/MPL/2.0/index.txt>
 * @package Deraner\Entity
 */
class User {

    use IdField;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length="256")
     */
    protected $mail;

    /**
     * Hashed value.
     *
     * @var string
     *
     * @ORM\Column(type="string", length="256")
     */
    protected $password;

    /**
     * @var Template
     *
     * @ORM\ManyToOne(targetEntity="Template", inversedBy="users")
     * @JoinColumn(name="template_id", referencedColumnName="id")
     */
    protected $template;

    /**
     * Creates a new user object.
     * @param string $mail
     * @param string $password
     * @return User
     */
    public static function create(string $mail, string $password) {
        $user = new User();
        $user->mail = $mail;
        $user->password = $password;

        return $user;
    }

    /**
     * @return string
     */
    public function getMail() {
        return $this->mail;
    }

    /**
     * @return Template
     */
    public function getTemplate() {
        return $this->template;
    }

    /**
     * @param Template $template
     */
    public function setTemplate(Template $template) {
        $this->template = $template;
    }
}