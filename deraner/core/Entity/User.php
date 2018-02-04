<?php

namespace Deraner\Entity;

use Deraner\Entity\Fields\IdField;
use Doctrine\ORM\Mapping AS ORM;
use Deraner\Security\User as SecureUser;
use Symfony\Component\Security\Core\User\UserInterface;

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
class User extends SecureUser {
    use IdField;

    const Mail = 'mail';
    const Password = 'password';
    const Salt = 'salt';
    const Template = 'template';

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=256)
     */
    protected $mail;

    /**
     * Hashed value.
     *
     * @var string
     *
     * @ORM\Column(type="string", length=256)
     */
    protected $password;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=256)
     */
    protected $salt;

    /**
     * @var Template
     *
     * @ORM\ManyToOne(targetEntity="Template", inversedBy="users")
     * @ORM\JoinColumn(name="template_id", referencedColumnName="id")
     */
    protected $template;

    /**
     * @param string $mail
     * @param null|string $password
     * @return User
     */
    public static function create(string $mail, ?string $password) {
        $user = new User();
        $user->mail = $mail;
        $user->password = $password;
        $user->salt = 'abcd';

        return $user;
    }

    /**
     * @return string
     */
    public function getMail() : string {
        return $this->mail;
    }

    /**
     * @return string
     */
    public function getPassword() : string {
        return $this->password;
    }

    /**
     * @param string $password
     * @return User
     */
    public function setPassword(string $password) : self {
        $this->password = $password;
        return $this;
    }

    /**
     * @return null|string
     */
    public function getSalt() : ?string {
        return $this->salt;
    }

    /**
     * @return Template|null
     */
    public function getTemplate() : ?Template {
        return $this->template;
    }

    /**
     * @param Template $template
     * @return User
     */
    public function setTemplate(Template $template) : self{
        $this->template = $template;
        return $this;
    }

    /**
     * Returns the roles granted to the user.
     *
     * <code>
     * public function getRoles()
     * {
     *     return array('ROLE_USER');
     * }
     * </code>
     *
     * Alternatively, the roles might be stored on a ``roles`` property,
     * and populated in any number of different ways when the user object
     * is created.
     *
     * @return (Role|string)[] The user roles
     */
    public function getRoles()
    {
        // TODO: Implement getRoles() method.
        return ['USER'];
    }

    /**
     * Returns the username used to authenticate the user.
     *
     * @return string The username
     */
    public function getUsername() : string {
        return preg_split('/@/is', $this->getMail())[0];
    }

    /**
     * return void
     */
    public function eraseCredentials() {
    }

    /**
     * @param UserInterface $user
     * @return bool
     */
    public function isEqualTo(UserInterface $user) {
        if (!$user instanceof User) {
            return false;
        }

        if ($this->password !== $user->getPassword()) {
            return false;
        }

        if ($this->salt !== $user->getSalt()) {
            return false;
        }

        if ($this->mail !== $user->getMail()) {
            return false;
        }

        return true;
    }
}