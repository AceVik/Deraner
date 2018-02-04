<?php

namespace Deraner\Security;

use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\EquatableInterface;

/**
 * Class User
 *
 * @author	Viktor Machnik <viktor@machnik.online>
 * @license	Mozilla Public License 2.0 <https://www.mozilla.org/media/MPL/2.0/index.txt>
 * @package Deraner\Security
 */
abstract class User implements UserInterface, EquatableInterface {
}