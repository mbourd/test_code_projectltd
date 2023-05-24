<?php

namespace App\Controller;

use App\Entity\Team;
use App\Form\PlayerType;
use App\Form\TeamType;
use App\Service\CountryService;
use App\Service\TeamService;
use FOS\RestBundle\Controller\{
    Annotations as Rest,
    AbstractFOSRestController
};
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\Translation\TranslatorInterface;

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
     * @throws Exception
     * @param TeamService $teamService
     * @param LoggerInterface $logger
     *
     * @return array
     */
    public function getAllTeam(TeamService $teamService, LoggerInterface $logger): array
    {
        try {
            return $teamService->getAll();
        } catch (\Throwable $e) {
            $logger->error($e->getMessage(), $e->getTrace());
            throw $e;
        }
    }

    /**
     * @Rest\Get("/{idTeam}")
     *
     * @throws EntityNotFoundException
     * @param int $idTeam
     * @param Request $request
     * @param TeamService $teamService
     * @param TranslatorInterface $translator
     * @param LoggerInterface $logger
     *
     * @return Team
     */
    public function getTeam(int $idTeam, Request $request, TeamService $teamService, TranslatorInterface $translator, LoggerInterface $logger): Team
    {
        try {
            // Get the language
            $lng = $request->headers->get('lng');

            $entity = $teamService->getById($idTeam);

            if (is_null($entity)) {
                throw new EntityNotFoundException($translator->trans("controller.team.getTeam.teamNotFound", [
                    "{{id}}" => $$idTeam
                ], 'messages', $lng));
            }

            return $entity;
        } catch (EntityNotFoundException $e) {
            $logger->error($e->getMessage(), $e->getTrace());
            throw $e;
        }
    }

    /**
     * @Rest\Post("/create")
     *
     * @throws Exception
     * @param Request $request
     * @param TeamService $teamService
     * @param TranslatorInterface $translator
     * @param LoggerInterface $logger
     *
     * @return Team
     */
    public function createTeam(Request $request, TeamService $teamService, CountryService $countryService, TranslatorInterface $translator, LoggerInterface $logger): Team
    {
        try {
            // Get the language
            $lng = $request->headers->get('lng');

            // Retrieve data
            $data = json_decode($request->getContent(), true);

            if (!isset($data['country']) || is_null($data['country'])) {
                throw new EntityNotFoundException($translator->trans('controller.team.createTeam.countryIdNull', [], 'messages', $lng));
            }

            $country = $countryService->getById($data['country']);

            if (is_null($country)) {
                throw new EntityNotFoundException($translator->trans("controller.team.createTeam.countryNotFound", [
                    "{{id}}" => $data['country']
                ], 'messages', $lng));
            }

            foreach ($data['players'] as $player) {
                $_player = array_merge([], $player);
                $form = $this->createForm(PlayerType::class, null, ['method' => 'POST', 'csrf_protection' => false]);
                $form->submit($_player, true);
                if (!$form->isValid()) {
                    throw new Exception($form->getErrors(true, true));
                }
            }

            // Check form type for Team
            $form = $this->createForm(TeamType::class, null, ['method' => 'POST', 'csrf_protection' => false]);
            $form->submit($data, true);
            if (!$form->isValid()) {
                throw new Exception($form->getErrors(true, true));
            }

            return $teamService->createTeam($data);
        } catch (\Throwable $e) {
            $logger->error($e->getMessage(), $e->getTrace());
            throw $e;
        }
    }

    /**
     * @Rest\Put("/proceedSells")
     *
     * @throws Exception
     * @param Request $request
     * @param TeamService $teamService
     * @param TranslatorInterface $translator
     * @param LoggerInterface $logger
     *
     * @return Team
     */
    public function proceedSells(Request $request, TeamService $teamService, TranslatorInterface $translator, LoggerInterface $logger): array
    {
        try {
            // Get the language
            $lng = $request->headers->get('lng');

            // Retrieve data
            $data = json_decode($request->getContent(), true);

            // Check if keys exists
            if (!isset($data['idTeam1']) || is_null($data['idTeam1'])) {
                throw new EntityNotFoundException($translator->trans("controller.team.proceedSells.idTeam1Null", [], 'messages', $lng));
            }
            if (!isset($data['idTeam2']) || is_null($data['idTeam2'])) {
                throw new EntityNotFoundException($translator->trans("controller.team.proceedSells.idTeam2Null", [], 'messages', $lng));
            }
            if (!isset($data['playersToSell1']) || !isset($data['playersToSell2'])) {
                throw new Exception($translator->trans("controller.team.proceedSells.playersToSellMissing", [], 'messages', $lng));
            }
            if (!is_array($data['playersToSell1'])) {
                throw new Exception($translator->trans("controller.team.proceedSells.playersToSell1NotArray", [], 'messages', $lng));
            }
            if (!is_array($data['playersToSell2'])) {
                throw new Exception($translator->trans("controller.team.proceedSells.playersToSell2NotArray", [], 'messages', $lng));
            }

            $idTeam1 = $data['idTeam1'];
            $idTeam2 = $data['idTeam2'];
            $team1 = $teamService->getById($idTeam1);
            $team2 = $teamService->getById($idTeam2);

            if (is_null($team1)) {
                throw new EntityNotFoundException($translator->trans("controller.team.proceedSells.teamNotFound", [
                    "{{id}}" => $data['idTeam1']
                ], 'messages', $lng));
            }
            if (is_null($team2)) {
                throw new EntityNotFoundException($translator->trans("controller.team.proceedSells.teamNotFound", [
                    "{{id}}" => $data['idTeam2']
                ], 'messages', $lng));
            }
            if ($team1->getId() === $team2->getId()) {
                throw new Exception($translator->trans("controller.team.proceedSells.sameTeamNotAllowed", [], 'messages', $lng));
            }

            // Check type for every player
            foreach ([$data['playersToSell1'], $data['playersToSell2']] as $playersToSell) {
                foreach ($playersToSell as $player) {
                    $_player = array_merge([], $player);
                    unset($_player['price']);
                    unset($_player['id']);
                    $form = $this->createForm(PlayerType::class, null, ['method' => 'POST', 'csrf_protection' => false]);
                    $form->submit($_player, true);
                    if (!$form->isValid()) {
                        throw new Exception($form->getErrors(true, true));
                    }
                }
            }

            // Check balances
            $income1 = array_reduce($data['playersToSell1'], function ($acc, $player) {
                return $acc + $player['price'];
            }, 0.0) - array_reduce($data['playersToSell2'], function ($acc, $player) {
                return $acc + $player['price'];
            }, 0.0);
            $income2 = array_reduce($data['playersToSell2'], function ($acc, $player) {
                return $acc + $player['price'];
            }, 0.0) - array_reduce($data['playersToSell1'], function ($acc, $player) {
                return $acc + $player['price'];
            }, 0.0);
            $balance1 = $team1->getMoneyBalance() + $income1;
            $balance2 = $team2->getMoneyBalance() + $income2;
            $data['newBalance1'] = $balance1;
            $data['newBalance2'] = $balance2;

            if ($balance1 < 0) {
                throw new Exception($translator->trans("controller.team.proceedSells.balanceNegative", [
                    "{{teamName}}" => $team1->getName()
                ], 'messages', $lng));
            }
            if ($balance2 < 0) {
                throw new Exception($translator->trans("controller.team.proceedSells.balanceNegative", [
                    "{{teamName}}" => $team2->getName()
                ], 'messages', $lng));
            }

            return $teamService->sellPlayersBetween($data, $team1, $team2);
        } catch (\Throwable $e) {
            $logger->error($e->getMessage(), $e->getTrace());
            throw $e;
        }
    }
}
