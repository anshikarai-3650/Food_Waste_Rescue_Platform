package food_rescue.controller;

import food_rescue.entity.Donation;
import food_rescue.entity.User;
import food_rescue.repository.DonationRepository;
import food_rescue.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonationController {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public DonationController(
            DonationRepository donationRepository,
            UserRepository userRepository) {

        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
    }

    // Add a new food donation
    @PostMapping
    public ResponseEntity<?> createDonation(@RequestBody Donation donation) {

        if (donation.getDonor() == null || donation.getDonor().getId() == null) {
            return ResponseEntity.badRequest()
                    .body("Donor ID is required");
        }

        User donor = userRepository.findById(donation.getDonor().getId())
                .orElse(null);

        if (donor == null) {
            return ResponseEntity.badRequest()
                    .body("Donor not found");
        }

        donation.setDonor(donor);
        donation.setStatus("AVAILABLE");

        Donation savedDonation = donationRepository.save(donation);

        return ResponseEntity.ok(savedDonation);
    }

    // Get all donations
    @GetMapping
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }
    @GetMapping("/donor/{donorId}")
public List<Donation> getDonationsByDonor(
        @PathVariable Long donorId) {

    return donationRepository.findByDonorId(donorId);
}

    // Get only available donations
    @GetMapping("/available")
    public List<Donation> getAvailableDonations() {
        return donationRepository.findByStatus("AVAILABLE");
    }
}