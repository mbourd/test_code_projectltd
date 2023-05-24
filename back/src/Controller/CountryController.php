<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\CountryService;
use FOS\RestBundle\Controller\{
    Annotations as Rest,
    AbstractFOSRestController
};
use Psr\Log\LoggerInterface;
use Exception;

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
     * @throws Exception
     * @param CountryService $countryService
     * @param LoggerInterface $logger
     *
     * @return array
     */
    public function getAllCountry(CountryService $countryService, LoggerInterface $logger): array
    {
        try {
            return $countryService->getAll();
        } catch (\Throwable $e) {
            $logger->error($e->getMessage(), $e->getTrace());
            throw $e;
        }
    }
}
