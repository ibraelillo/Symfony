<?php
/**
 * Created by JetBrains PhpStorm.
 * @author: Ibrael
 * Date: 15/03/13
 * Time: 16:06
 */

namespace Application\Sonata\MediaBundle\DataFixtures\ORM;


use Application\Sonata\MediaBundle\Entity\Media;
use Application\Sonata\MediaBundle\Entity\Gallery;
use Application\Sonata\MediaBundle\Entity\GalleryHasMedia;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Gwada\GitesBundle\Entity\Location;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class MediaFixtures extends AbstractFixture implements OrderedFixtureInterface, ContainerAwareInterface
{
    private $container;



    public  function load(ObjectManager $manager)
    {
        $locations = $manager->getRepository('GitesBundle:Location')->findAll();
        $mediaManager = $this->container->get('sonata.media.entity_manager');

        foreach($locations as $loc)
        {
            $gallery = new Gallery();
            $gallery->setContext('default');
            $gallery->setName($loc->getNombre());
            $gallery->setDefaultFormat('big');
            $gallery->setEnabled(true);


            for($i = 0 ; $i < 4; $i++)
            {
                $media = new Media();
                $media->setName($loc->getNombre().' '.$i);
                $media->setContext('default'); // video related to the user
                $media->setProviderName('sonata.media.provider.image');
                $media->setProviderStatus(1);
                $media->setProviderReference("sonata.media.provider.image");
                $media->setEnabled(true);

                $ghm = new GalleryHasMedia();
                $ghm->setMedia($media);

                $gallery->addGalleryHasMedias($ghm);
            }

            $loc->setGallery($gallery);

            $manager->persist($loc);
        }

        $manager->flush();


    }

    /**
     * Sets the Container.
     *
     * @param ContainerInterface $container A ContainerInterface instance
     *
     * @api
     */
    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    /**
     * Get the order of this fixture
     *
     * @return integer
     */
    function getOrder()
    {
        return 100;
    }
}