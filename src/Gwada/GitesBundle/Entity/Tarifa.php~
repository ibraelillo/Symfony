<?php
/**
 * Created by JetBrains PhpStorm.
 * @author: Ibrael
 * Date: 8/03/13
 * Time: 14:08
 */
namespace Gwada\GitesBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gwada\GitesBundle\Entity\Location;

/**
 * @ORM\Entity
 */
class Tarifa
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=100)
     * @ORM\GeneratedValue
     */
    protected $id;

    /** @ORM\Column(type="integer") */
    protected $baja;

    /** @ORM\Column(type="integer") */
    protected $media;

    /** @ORM\Column(type="integer") */
    protected $alta;

    /** @ORM\Column(type="integer") */
    protected $activo;


    /** @ORM\OneToOne(targetEntity="Location", mappedBy="precio_base", cascade="persist") */
    protected $location;


    public function getPrecioActual()
    {
        switch($this->getActivo())
        {
            case 1: return $this->getAlta();
            case 2: return $this->getMedia();
            default: return $this->getBaja();
        }
    }

    public function __toString()
    {
        return sprintf("Actual: %s (Haute: %s, Moyenne: %s, Bas: %s)", $this->getPrecioActual(), $this->getAlta(), $this->getMedia(), $this->getBaja());
    }



    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set baja
     *
     * @param integer $baja
     * @return Tarifa
     */
    public function setBaja($baja)
    {
        $this->baja = $baja;
    
        return $this;
    }

    /**
     * Get baja
     *
     * @return integer 
     */
    public function getBaja()
    {
        return $this->baja;
    }

    /**
     * Set media
     *
     * @param integer $media
     * @return Tarifa
     */
    public function setMedia($media)
    {
        $this->media = $media;
    
        return $this;
    }

    /**
     * Get media
     *
     * @return integer 
     */
    public function getMedia()
    {
        return $this->media;
    }

    /**
     * Set alta
     *
     * @param integer $alta
     * @return Tarifa
     */
    public function setAlta($alta)
    {
        $this->alta = $alta;
    
        return $this;
    }

    /**
     * Get alta
     *
     * @return integer 
     */
    public function getAlta()
    {
        return $this->alta;
    }

    /**
     * Set activo
     *
     * @param integer $activo
     * @return Tarifa
     */
    public function setActivo($activo)
    {
        $this->activo = $activo;
    
        return $this;
    }

    /**
     * Get activo
     *
     * @return integer 
     */
    public function getActivo()
    {
        return $this->activo;
    }

    /**
     * Set location
     *
     * @param \Gwada\GitesBundle\Entity\Location $location
     * @return Tarifa
     */
    public function setLocation(\Gwada\GitesBundle\Entity\Location $location = null)
    {
        $this->location = $location;
    
        return $this;
    }

    /**
     * Get location
     *
     * @return \Gwada\GitesBundle\Entity\Location 
     */
    public function getLocation()
    {
        return $this->location;
    }
}