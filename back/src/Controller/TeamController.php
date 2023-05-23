<?php

namespace App\Controller;

use App\Entity\Team;
use App\Form\CountryType;
use App\Form\TeamType;
use App\Service\TeamService;
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
 * Class TeamController
 * @package App\Controller
 *
 * @Rest\Route("/team")
 */
class TeamController extends AbstractFOSRestController
{
    /**
     * @Rest\Get("/all")
     *
     * @param TeamService $teamService
     *
     * @return array
     */
    public function getAllTeam(TeamService $teamService): array
    {
        return $teamService->getAll();
    }

    /**
     * @Rest\Get("/{idTeam}")
     *
     * @param int $idTeam
     * @param TeamService $teamService
     *
     * @return Team
     */
    public function getTeam(int $idTeam, TeamService $teamService, LoggerInterface $logger): Team
    {
        try {
            return $teamService->getById($idTeam);
        } catch (EntityNotFoundException $e) {
            $logger->error($e->getMessage(), $e->getTrace());
            throw $e;
        }
    }

    /**
     * @Rest\Post("/create")
     *
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @param \App\Service\TeamService $teamService
     * @param \Psr\Log\LoggerInterface $logger
     *
     * @return Team
     */
    public function createTeam(Request $request, TeamService $teamService, LoggerInterface $logger): Team
    {
        $data = json_decode($request->getContent(), true);

        try {
            $dataCountry = $data['country'];
            $form = $this->createForm(CountryType::class, null, ['method' => 'POST', 'csrf_protection' => false]);
            $form->submit($dataCountry, true);
            if ($form->isValid()) {
                throw new Exception($form->getErrors(true, true));
            }

            $tmp = $data['players'];
            $data['players'] = new ArrayCollection();
            foreach ($tmp as $value) {
                $data['players']->add($value);
            }
            $form = $this->createForm(TeamType::class, null, ['method' => 'POST', 'csrf_protection' => false]);
            $form->submit($data, true);
            if ($form->isValid()) {
                throw new Exception($form->getErrors(true, true));
            }
            return $teamService->createTeam($data);
        } catch (\Throwable $e) {
            $logger->error($e->getMessage(), $e->getTrace());
            throw $e;
        }
    }
}
