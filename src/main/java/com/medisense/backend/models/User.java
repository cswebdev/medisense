package com.medisense.backend.models;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users", uniqueConstraints = {
		@UniqueConstraint(columnNames = "email")
})
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long user_id;

	@NotBlank
	@Size(max = 50)
	private String email;

	@NotBlank
	@Size(max = 50)
	private String first_name;

	@NotBlank
	@Size(max = 50)
	private String last_name;

	@NotBlank
	@Size(max = 100)
	private String password;

	@OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Medication> medications;

	public User() {

	}

	public User(String email, String first_name, String last_name, String password) {
		this.email = email;
		this.first_name = first_name;
		this.last_name = last_name;
		this.password = password;
	}

	public Long getId() {
		return user_id;
	}

	public void setId(Long id) {
		this.user_id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFirst_name() {
		return first_name;
	}

	public void setFirst_name(String first_name) {
		this.first_name = first_name;
	}

	public String getLast_name() {
		return last_name;
	}

	public void setLast_name(String last_name) {
		this.last_name = last_name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
