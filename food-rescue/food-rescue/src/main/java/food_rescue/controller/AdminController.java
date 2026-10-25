
package food_rescue.controller;

import food_rescue.repository.UserRepository;
import food_rescue.repository.DonationRepository;
import food_rescue.repository.ClaimRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final DonationRepository donationRepository;
    private final ClaimRepository claimRepository;

    public AdminController(
            UserRepository userRepository,
            DonationRepository donationRepository,
            ClaimRepository claimRepository) {
        this.userRepository = userRepository;
        this.donationRepository = donationRepository;
        this.claimRepository = claimRepository;
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        return Map.of(
            "totalUsers", userRepository.count(),
            "totalDonations", donationRepository.count(),
            "totalClaims", claimRepository.count()
        );
    }
}
