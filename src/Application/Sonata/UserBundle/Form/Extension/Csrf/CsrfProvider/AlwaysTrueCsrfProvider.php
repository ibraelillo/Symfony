<?php
/**
 * Created by JetBrains PhpStorm.
 * @author: ibra
 * Date: 25/03/13
 * Time: 2:21
 */

namespace Application\Sonata\UserBundle\Form\Extension\Csrf\CsrfProvider;

use Symfony\Component\Form\Extension\Csrf\CsrfProvider\DefaultCsrfProvider as BaseCsrfProvider;


class AlwaysTrueCsrfProvider extends BaseCsrfProvider
{
    /**
     * {@inheritDoc}
     */
    public function isCsrfTokenValid($intention, $token)
    {
        return true;
    }
}