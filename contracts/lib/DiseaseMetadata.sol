// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

struct BagForVaccine {
    string[5] vaccines;
}

contract DiseaseMetadata {
    string[] private InfectionLevel1 = [
        "Ebola", "Smallpox", "Anthrax",
        "H1N1", "Animal influenza", "SARS", "MERS"
    ];
    string[] private InfectionLevel2 = [
        "Tuberculosis", "Varicella", "Measles",
        "Cholera", "Typhoid", "HAV", "Whooping cough",
        "COVID-19", "Rubella", "Monkeypox", "HEV", 
        "Pneumococcal", "Leprosy", "Scarlatina"
    ];
    string[] private InfectionLevel3 = [
        "Tetanus", "HBV", "Japanese encephalitis",
        "HCV", "Malaria", "Typhus", "Vibrio vulnificus", "Murine Typhus",
        "AIDS", "Yellow fever", "Dengue fever", "Lyme disease", "Tick-borne viral encephalitis",
        "Normal Influenza", "Ascariasis", "Enterobius vermicularis", "Trichuriasis",
        "Gonorrhea", "Salmonella", "Vibrio parahaemolyticus", "VRSA", "Norovirus",
        "Adenovirus", "Filariasis", "Primary syphilis", "Secondary syphilis", "Congenital syphilis"
    ];

    constructor() payable { }

    function getRandomNumber(uint256 mintNumber) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, mintNumber, block.number)));
    }

    function getRandomDisease(uint256 mintNumber) public view returns (string memory) {
        uint8 randNumber = uint8(getRandomNumber(mintNumber) % 10);
        uint8 randNumberInside = uint8(getRandomNumber(mintNumber * mintNumber) % InfectionLevel3.length);

        // randNumber >= 9 : InfectionLevel1
        // 6 <= randNumber <= 8 : InfectionLevel2
        // 0 <= randNumber <= 5 : InfectionLevel3
        if (randNumber >= 9) {
            // InfectionLevel1
            return InfectionLevel1[randNumberInside % InfectionLevel1.length];
        }
        else if (randNumber >= 6 && randNumber <= 8) {
            // InfectionLevel2
            return InfectionLevel2[randNumberInside % InfectionLevel2.length];
        }
        else {
            // InfectionLevel3
            return InfectionLevel3[randNumberInside % InfectionLevel3.length];
        }
    }

    function getBagsForVaccination(uint256 mintNumber) external view returns (BagForVaccine memory) {
        BagForVaccine memory newBag;

        for(uint i = 0; i < 5; i++) {
            newBag.vaccines[i] = getRandomDisease(mintNumber);
        }

        return newBag;
    }
}