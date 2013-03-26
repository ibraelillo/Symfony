<?php
/**
 * Created by JetBrains PhpStorm.
 * @author: ibra
 * Date: 25/03/13
 * Time: 2:02
 */

namespace Application\Sonata\UserBundle\Security\Http\Authentication;


use JMS\Serializer\SerializerInterface;

use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Http\Logout\LogoutSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class AjaxAuthenticationHandler implements AuthenticationSuccessHandlerInterface, LogoutSuccessHandlerInterface, AuthenticationFailureHandlerInterface
{


    protected $serializer;

    public function setSerializer(SerializerInterface $serializer = null)
    {
        $this->serializer = $serializer;
    }


    /**
     * {@inheritDoc}
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        // We keep the relevant infos of the exception
        $alert = array(
            'message' => $exception->getMessage(),
            'level' => 'error');

        // And return the encoded alert in response
        $response = new Response(json_encode($alert), 403); // OK, this might not be the most appropriate HTTP status code, but apparently nobody agrees on this one
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    /**
     * {@inheritDoc}
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token)
    {
        // We grab the entity associated with the logged in user or null if user not logged in
        $user = $token->getUser();

        // We serialize it to JSON
        $json = $this->serializer->serialize($user, 'json');

        // And return the response
        $response = new Response($json);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    /**
     * {@inheritDoc}
     */
    public function onLogoutSuccess(Request $request)
    {
        // We create an alert for the client to optionnally display
        $alert = array(
            'level' => 'success',
            'message' => 'You successfully logged out');

        // And return the encoded alert in response
        $response = new Response(json_encode($alert));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}