package com.ridesharing.ridesharing.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ridesharing.ridesharing.entity.Driver;
import com.ridesharing.ridesharing.entity.Rider;

public interface RiderRepository extends JpaRepository<Rider, Long> {
    List<Rider> findByStatusIgnoreCase(String status);
    List<Rider> findByStatusIgnoreCaseAndDriverIsNull(String status);
    List<Rider> findByDriver(Driver driver);
    List<Rider> findByDriverAndStatusIgnoreCase(Driver driver, String status);
}
