package food_rescue.controller;

import food_rescue.entity.Claim;
import food_rescue.entity.Donation;
import food_rescue.entity.User;
import food_rescue.repository.ClaimRepository;
import food_rescue.repository.DonationRepository;
import food_rescue.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "*")
public class ClaimController {

    private final ClaimRepository claimRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public ClaimController(
            ClaimRepository claimRepository,
            DonationRepository donationRepository,
            UserRepository userRepository) {

        this.claimRepository = claimRepository;
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
    }

    // NGO claims a donation
    @PostMapping
    public ResponseEntity<?> createClaim(@RequestBody Claim claim) {

        if (claim.getDonation() == null ||
                claim.getDonation().getId() == null) {

            return ResponseEntity.badRequest()
                    .body("Donation ID is required");
        }

        if (claim.getNgo() == null ||
                claim.getNgo().getId() == null) {

            return ResponseEntity.badRequest()
                    .body("NGO ID is required");
        }

        Donation donation = donationRepository
                .findById(claim.getDonation().getId())
                .orElse(null);

        if (donation == null) {
            return ResponseEntity.badRequest()
                    .body("Donation not found");
        }

        if (!"AVAILABLE".equals(donation.getStatus())) {
            return ResponseEntity.badRequest()
                    .body("Donation is no longer available");
        }

        User ngo = userRepository
                .findById(claim.getNgo().getId())
                .orElse(null);

        if (ngo == null) {
            return ResponseEntity.badRequest()
                    .body("NGO not found");
        }

        claim.setDonation(donation);
        claim.setNgo(ngo);
        claim.setStatus("CLAIMED");

        donation.setStatus("CLAIMED");
        donationRepository.save(donation);

        Claim savedClaim = claimRepository.save(claim);

        return ResponseEntity.ok(savedClaim);
    }

    // Get all claims
    @GetMapping
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    // Get claims made by a particular NGO
    @GetMapping("/ngo/{ngoId}")
    public List<Claim> getClaimsByNgo(@PathVariable Long ngoId) {
        return claimRepository.findByNgoId(ngoId);
    }
}