<?php

namespace App\Service;

use App\Entity\{Team, Country, Player};
use App\Repository\CountryRepository;
use App\Repository\TeamRepository;
use Doctrine\ORM\{EntityManagerInterface, EntityNotFoundException};
use Laminas\Code\Generator\DocBlock\Tag;

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

    /**
     * TeamService constructor.
     * @param EntityManagerInterface $manager
     * @param CountryService $countryService
     */
    public function __construct(EntityManagerInterface $manager, CountryService $countryService)
    {
        $this->manager = $manager;
        $this->repo = $this->manager->getRepository(Team::class);
        $this->serviceCountry = $countryService;
    }

    public function getAll(): array
    {
        return $this->repo->findAll();
    }

    /**
     * @throws EntityNotFoundException
     * @param int $id
     * @return Team
     */
    public function getById(int $id): Team
    {
        $entity = $this->repo->find($id);

        if (is_null($entity)) {
            throw new EntityNotFoundException("Team id $id not found");
        }

        return $entity;
    }

    /**
     * @throws EntityNotFoundException
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
            $player->setTeam($team);
            $team->addPlayer($player);
        }

        $this->repo->save($team, true);

        return $team;
    }

    /**
     * @throws EntityNotFoundException
     * @param int $id
     */
    public function deleteTeam(int $id): void
    {
        $team = $this->repo->find($id);

        if (is_null($team)) {
            throw new EntityNotFoundException("Team id $id not found");
        }

        $this->repo->remove($team, true);
    }


    public function sellPlayer(Player $player, Team $team1, Team $team2)
    {

    }
}
