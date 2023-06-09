<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\{Team, Player};
use App\Repository\CountryRepository;
use App\Repository\TeamRepository;
use Doctrine\ORM\{EntityManagerInterface};

class TeamService
{
    /** @var EntityManagerInterface */
    protected $manager;

    /** @var TeamRepository */
    protected $repo;

    /** @var CountryRepository */
    protected $repoCountry;

    /** @var CountryService */
    protected $serviceCountry;

    /** @var PlayerService */
    protected $servicePlayer;

    /**
     * TeamService constructor.
     * @param EntityManagerInterface $manager
     * @param CountryService $countryService
     */
    public function __construct(EntityManagerInterface $manager, CountryService $countryService, PlayerService $playerService)
    {
        $this->manager = $manager;
        $this->repo = $this->manager->getRepository(Team::class);
        $this->serviceCountry = $countryService;
        $this->servicePlayer = $playerService;
    }

    /**
     * @return array
     */
    public function getAll(): array
    {
        return $this->repo->findAll();
    }

    /**
     * @param int $id
     * @return Team
     */
    public function getById(int $id): ?Team
    {
        $entity = $this->repo->find($id);

        return $entity;
    }

    /**
     * @param array $data
     * @return Team
     */
    public function createTeam(array $data): Team
    {
        $country = $this->serviceCountry->getById($data['country']);

        $team = new Team();
        $team->setName($data['name']);
        $team->setCountry($country);
        $team->setMoneyBalance(floatval($data['moneyBalance']));

        foreach ($data['players'] as $dataPlayer) {
            $player = new Player();
            $player->setName($dataPlayer['name']);
            $player->setSurname($dataPlayer['surname']);
            $team->addPlayer($player);
        }

        $this->repo->save($team, true);

        return $team;
    }

    /**
     * @param int $id
     */
    public function deleteTeam(int $id): void
    {
        $team = $this->repo->find($id);

        $this->repo->remove($team, true);
    }


    /**
     * Sell players between teams
     *
     * @param array $data
     * @param Team $team1
     * @param Team $team2
     *
     * @return array
     */
    public function sellPlayersBetween(array $data, Team $team1, Team $team2): array
    {
        foreach ($data['playersToSell1'] as $_player) {
            $player = $this->servicePlayer->getById($_player['id']);
            $player->setTeam($team2);
            $this->servicePlayer->save($player);
        }
        foreach ($data['playersToSell2'] as $_player) {
            $player = $this->servicePlayer->getById($_player['id']);
            $player->setTeam($team1);
            $this->servicePlayer->save($player);
        }

        $team1->setMoneyBalance($data['newBalance1']);
        $team2->setMoneyBalance($data['newBalance2']);

        $this->repo->save($team1);
        $this->repo->save($team2);

        $this->manager->flush();

        return [$team1, $team2];
    }
}
