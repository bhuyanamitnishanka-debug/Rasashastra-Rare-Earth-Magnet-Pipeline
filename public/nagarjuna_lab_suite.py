# =============================================================================
# NEPAL-BHARAT RASASHASTRA-AI: MAHARSHI NAGARJUNA LABORATORY TESTING SUITE
# Methodologies: Analytical Purification (Shodhana) and Distillation Verification
# =============================================================================
import math
import time

class NagarjunaLabManual:
    def __init__(self, yantra_type, compound_ore, raw_weight_grams):
        self.yantra_type = yantra_type        # Classical apparatus: "Dola_Yantra", "Koshthi_Yantra"
        self.compound_ore = compound_ore      # Material under evaluation: "Neodymium_Complex"
        self.raw_weight = raw_weight_grams    # Input mass metrics
        self.saturation_constant = 0.846      # Derived mathematical alignment index

    def run_shodhana_experiment(self, operational_heat_celsius, cycle_duration_hours):
        """Simulates text-based mineral ore purification and calculates volatile extraction loss"""
        print(f">> Initializing Experiment Matrix inside: {self.yantra_type}...")
        print(f">> Staging Target Compound Element: {self.compound_ore} ({self.raw_weight}g)")
        time.sleep(0.5) # Simulating apparatus heat balancing delay

        # Numerical evaluation logic based on thermal saturation thresholds
        if operational_heat_celsius >= 1100:
            volatilization_rate = math.exp(-1 / (cycle_duration_hours * self.saturation_constant))
            purified_yield = self.raw_weight * (1 - (volatilization_rate * 0.15))
            stress_on_musha = (operational_heat_celsius * 0.12) / cycle_duration_hours
            
            if stress_on_musha > 150.0:
                status = "CRITICAL: Thermal strain approaching crucible crack boundary threshold."
                safety_trip_triggered = True
            else:
                status = "OPTIMAL: Impurities vaporized successfully. Material crystalline properties locked."
                safety_trip_triggered = False
        else:
            purified_yield = self.raw_weight
            status = "FAILED: Insufficient heat energy to crack atomic mineral boundaries."
            safety_trip_triggered = False
            stress_on_musha = 0.0

        return {
            "experiment_status": status,
            "net_purified_yield_grams": round(purified_yield, 3),
            "calculated_crucible_strain_mpa": round(stress_on_musha, 2),
            "system_fail_safe_trip": safety_trip_triggered
        }

# --- TEST HARNESS EXECUTION PATH ---
if __name__ == "__main__":
    print("=" * 80)
    print("🔬 MAHARSHI NAGARJUNA LABORATORY CODE MATRIX: REAL-TIME EXTRACTION TEST 🔬")
    print("=" * 80)

    # Initialize experimental lab instance for processing rare-earth oxides
    experiment_node = NagarjunaLabManual(
        yantra_type="Koshthi_Yantra_Chamber",
        compound_ore="Neodymium-Samarium Rare-Earth Complex",
        raw_weight_grams=500.0
    )

    # Run distillation testing sequence at high temperature parameters
    results_matrix = experiment_node.run_shodhana_experiment(
        operational_heat_celsius=1350,
        cycle_duration_hours=6
    )

    print(f"[*] Execution Result  : {results_matrix['experiment_status']}")
    print(f"[*] Purified Ore Mass : {results_matrix['net_purified_yield_grams']} grams")
    print(f"[*] Crucible Strain   : {results_matrix['calculated_crucible_strain_mpa']} Mpa")
    print(f"[*] Fail-Safe Tripped : {results_matrix['system_fail_safe_trip']}")
    print("=" * 80)
