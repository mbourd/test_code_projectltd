<?php

namespace App\Controller;

use App\Entity\Country;
use App\Service\CountryService;
use Doctrine\Common\Collections\ArrayCollection;
use FOS\RestBundle\Controller\{
    Annotations as Rest,
    AbstractFOSRestController
};
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Exception;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class CountryController
 * @package App\Controller
 *
 * @Rest\Route("/country")
 */
class CountryController extends AbstractFOSRestController
{
    /**
     * @Rest\Get("/all")
     *
     * @param CountryService $countryService
     *
     * @return array
     */
    public function getAllTeam(CountryService $countryService): array
    {
        return $countryService->getAll();
    }
}
