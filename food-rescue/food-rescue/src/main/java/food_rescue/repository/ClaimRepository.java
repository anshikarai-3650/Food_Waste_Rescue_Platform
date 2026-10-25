package food_rescue.repository;

import food_rescue.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByNgoId(Long ngoId);

    List<Claim> findByDonationId(Long donationId);
}