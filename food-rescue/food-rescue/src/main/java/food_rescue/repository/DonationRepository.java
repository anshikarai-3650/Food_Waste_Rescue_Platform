package food_rescue.repository;

import food_rescue.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByStatus(String status);
    List<Donation> findByDonorId(Long donorId);
}