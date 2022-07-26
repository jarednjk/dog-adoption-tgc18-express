function validateDogName(dogName) {
    if (typeof (dogName) !== 'string' || !dogName.match(/^[A-Za-z]+( [A-Za-z]+)*$/)) {
        return false;
    }
}

function validateBreed(breed) {
    if (typeof (breed) !== 'string' || !breed.match(/^[A-Za-z]+( [A-Za-z]+)*$/)) {
        return false;
    }
}

function validateDateOfBirth(dateOfBirth) {
    if (typeof (dateOfBirth) !== 'string' || !dateOfBirth.match(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)) {
        return false;
    }
}

function validateGender(gender) {
    if (gender !== 'male' && gender !== 'female') {
        return false;
    }
}

function validateDescription(description) {
    if (typeof (description) !== 'string' || description.length < 50) {
        return false;
    }
}

function validateHypoallergenic(hypoallergenic) {
    if (hypoallergenic !== true && hypoallergenic !== false) {
        return false;
    }
}

function validatePictureUrl(pictureUrl) {
    if (!pictureUrl.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)) {
        return false;
    }
}

function validateToiletTrained(toiletTrained) {
    if (toiletTrained !== true && toiletTrained !== false) {
        return false;
    }
}

function validateHealthStatus(healthStatus) {
    if (!Array.isArray(healthStatus)) {
        // send error if not array
        return false;
    } else {
        [...healthStatus].map(hstatus => {
            if (!hstatus.includes('sterilized') && !hstatus.includes('vaccinated') && !hstatus.includes('microchipped')) {
                // send error if not any of the values
                return false;
            }
        })
    }
}

function validateFamilyStatus(familyStatus) {
    if (!Array.isArray(familyStatus)) {
        // send error if not array
        return false;
    } else {
        [...familyStatus].map(fstatus => {
            if (!fstatus.includes('hdbApproved') && !fstatus.includes('goodWithKids') && !fstatus.includes('goodWithOtherDogs')) {
                // send error if not any of the values
                return false;
            }
        })
    }
}

function validateTemperament(temperament) {
    if (!Array.isArray(temperament) || temperament.length < 1 || temperament.length > 3) {
        return false;
    } else {
        [...temperament].map(t => {
            if (!t.includes('good-natured') && !t.includes('shy') && !t.includes('aggressive') && !t.includes('laid-back') && !t.includes('playful')) {
                return false;
            }
        })
    }
}

function validateOwnerName(ownerName) {
    if (typeof (ownerName) !== 'string' || !ownerName.match(/^[A-Za-z]+( [A-Za-z]+)*$/)) {
        return false;
    }
}

function validateEmail(email) {
    if (typeof (email) !== 'string' || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return false;
    }
}

module.exports = {
    validateDogName, validateBreed, validateDateOfBirth, validateGender, validateDescription,
    validateHypoallergenic, validatePictureUrl, validateToiletTrained, validateHealthStatus,
    validateFamilyStatus, validateTemperament, validateOwnerName, validateEmail
}