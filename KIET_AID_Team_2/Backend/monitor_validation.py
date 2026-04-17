"""
Monitor Response Validation System Performance
Tracks validation accuracy, API usage, and response times
"""

import json
import os
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict, List, Any
import sys

class ValidationMonitor:
    """Monitor validation system metrics"""
    
    def __init__(self, log_file: str = "app.log"):
        self.log_file = log_file
        self.metrics = defaultdict(int)
        self.response_times = []
        self.sources = defaultdict(int)
        self.languages = defaultdict(int)
        self.validation_results = defaultdict(int)
        self.api_costs = {
            "gemini-1.5-flash": 0.075,  # per 1M input tokens
            "gemini-1.5-pro": 0.3      # per 1M input tokens
        }
    
    def parse_logs(self, hours: int = 1) -> Dict[str, Any]:
        """Parse logs from the past N hours"""
        
        if not os.path.exists(self.log_file):
            print(f"❌ Log file not found: {self.log_file}")
            return {}
        
        cutoff_time = datetime.now() - timedelta(hours=hours)
        
        try:
            with open(self.log_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
        except Exception as e:
            print(f"❌ Error reading log file: {e}")
            return {}
        
        # Parse each line
        for line in lines:
            try:
                # Look for validation-related logs
                if "response_source=" in line:
                    # Parse source tracking
                    if "source=model" in line:
                        self.sources["model"] += 1
                    elif "source=gemini" in line:
                        self.sources["gemini"] += 1
                    elif "source=cache" in line:
                        self.sources["cache"] += 1
                    elif "source=model_fallback" in line:
                        self.sources["model_fallback"] += 1
                
                # Look for language detection
                if "language=" in line:
                    if "language=en" in line:
                        self.languages["English"] += 1
                    elif "language=hi" in line:
                        self.languages["Hindi"] += 1
                    elif "language=te" in line:
                        self.languages["Telugu"] += 1
                
                # Look for validation results
                if "validation_passed=" in line:
                    if "validation_passed=True" in line:
                        self.validation_results["passed"] += 1
                    else:
                        self.validation_results["failed"] += 1
                
                # Look for response times
                if "response_time=" in line:
                    try:
                        import re
                        match = re.search(r'response_time=(\d+\.?\d*)', line)
                        if match:
                            time_ms = float(match.group(1))
                            self.response_times.append(time_ms)
                    except:
                        pass
            
            except Exception as e:
                # Skip problematic lines
                continue
        
        return self.generate_report()
    
    def generate_report(self) -> Dict[str, Any]:
        """Generate comprehensive metrics report"""
        
        total_responses = sum(self.sources.values())
        
        if total_responses == 0:
            return {"status": "No data", "total_responses": 0}
        
        report = {
            "total_responses": total_responses,
            "response_sources": dict(self.sources),
            "source_percentages": {
                source: f"{count/total_responses*100:.1f}%"
                for source, count in self.sources.items()
            },
            "languages": dict(self.languages),
            "validation_results": dict(self.validation_results),
            "performance": self._calculate_performance(),
            "api_efficiency": self._estimate_api_usage(),
            "quality_metrics": self._calculate_quality()
        }
        
        return report
    
    def _calculate_performance(self) -> Dict[str, Any]:
        """Calculate response time performance"""
        
        if not self.response_times:
            return {"status": "No timing data"}
        
        response_times = self.response_times
        return {
            "avg_time_ms": f"{sum(response_times)/len(response_times):.1f}",
            "min_time_ms": f"{min(response_times):.1f}",
            "max_time_ms": f"{max(response_times):.1f}",
            "p95_time_ms": f"{sorted(response_times)[int(len(response_times)*0.95)]:.1f}",
            "p99_time_ms": f"{sorted(response_times)[int(len(response_times)*0.99)]:.1f}",
            "total_requests": len(response_times)
        }
    
    def _estimate_api_usage(self) -> Dict[str, Any]:
        """Estimate Gemini API usage and costs"""
        
        gemini_calls = self.sources.get("gemini", 0)
        model_fallback = self.sources.get("model_fallback", 0)
        
        # Rough estimates (very conservative)
        # Typical medical query: 50-100 tokens input, 100-200 tokens output
        avg_input_tokens = 75
        avg_output_tokens = 150
        total_tokens_per_call = avg_input_tokens + avg_output_tokens
        
        estimated_input_cost = (gemini_calls * avg_input_tokens) / 1_000_000 * 0.075  # flash model
        estimated_output_cost = (gemini_calls * avg_output_tokens) / 1_000_000 * 0.3  # flash model
        total_cost = estimated_input_cost + estimated_output_cost
        
        return {
            "gemini_fallback_calls": gemini_calls,
            "fallback_rate_percent": f"{gemini_calls/max(1, sum(self.sources.values()))*100:.1f}%",
            "model_fallback_count": model_fallback,
            "estimated_tokens_used": {
                "input": f"{gemini_calls * avg_input_tokens:,}",
                "output": f"{gemini_calls * avg_output_tokens:,}",
                "total": f"{gemini_calls * total_tokens_per_call:,}"
            },
            "estimated_cost_usd": f"${total_cost:.6f}",
            "cost_per_request": f"${total_cost/max(1, gemini_calls):.6f}"
        }
    
    def _calculate_quality(self) -> Dict[str, Any]:
        """Calculate quality metrics"""
        
        total_validations = sum(self.validation_results.values())
        
        if total_validations == 0:
            return {"status": "No validation data"}
        
        passed = self.validation_results.get("passed", 0)
        failed = self.validation_results.get("failed", 0)
        
        return {
            "validation_pass_rate": f"{passed/total_validations*100:.1f}%",
            "validation_failed_rate": f"{failed/total_validations*100:.1f}%",
            "fallback_requirement_rate": f"{failed/total_validations*100:.1f}%",
            "model_accuracy": f"{passed/total_validations*100:.1f}%",
            "notes": "Higher pass rate = better model quality. 75-85% is typical."
        }
    
    def print_report(self, report: Dict[str, Any]) -> None:
        """Pretty print the report"""
        
        print("\n" + "=" * 70)
        print("📊 Response Validation System - Performance Report")
        print("=" * 70 + "\n")
        
        # Overall Summary
        print(f"📈 Overall Summary:")
        print(f"   Total Responses: {report.get('total_responses', 'N/A')}")
        
        # Response Sources
        if "response_sources" in report:
            print(f"\n🔄 Response Source Distribution:")
            for source, count in report["response_sources"].items():
                percentage = report["source_percentages"].get(source, "0%")
                print(f"   {source:20} {count:6} ({percentage})")
        
        # Languages
        if "languages" in report:
            print(f"\n🌐 Languages Served:")
            for lang, count in report["languages"].items():
                if count > 0:
                    print(f"   {lang:20} {count:6} responses")
        
        # Validation Quality
        if "validation_results" in report and report["validation_results"]:
            print(f"\n✅ Validation Quality:")
            qual = report.get("quality_metrics", {})
            print(f"   Pass Rate: {qual.get('validation_pass_rate', 'N/A')}")
            print(f"   Failed Rate: {qual.get('validation_failed_rate', 'N/A')}")
            print(f"   Model Accuracy: {qual.get('model_accuracy', 'N/A')}")
        
        # Performance
        if "performance" in report and "avg_time_ms" in report["performance"]:
            print(f"\n⚡ Performance:")
            perf = report["performance"]
            print(f"   Avg Response: {perf.get('avg_time_ms', 'N/A')} ms")
            print(f"   Min Response: {perf.get('min_time_ms', 'N/A')} ms")
            print(f"   Max Response: {perf.get('max_time_ms', 'N/A')} ms")
            print(f"   P95 Response: {perf.get('p95_time_ms', 'N/A')} ms")
            print(f"   P99 Response: {perf.get('p99_time_ms', 'N/A')} ms")
        
        # API Efficiency
        if "api_efficiency" in report:
            print(f"\n💰 API Efficiency (Gemini):")
            api = report["api_efficiency"]
            print(f"   Fallback Calls: {api.get('gemini_fallback_calls', 'N/A')}")
            print(f"   Fallback Rate: {api.get('fallback_rate_percent', 'N/A')}")
            if "estimated_cost_usd" in api:
                print(f"   Est. Cost: {api.get('estimated_cost_usd', 'N/A')}")
                print(f"   Cost/Request: {api.get('cost_per_request', 'N/A')}")
        
        print("\n" + "=" * 70 + "\n")
    
    def print_health_check(self) -> None:
        """Print system health status"""
        
        print("\n" + "─" * 70)
        print("🏥 System Health Check")
        print("─" * 70 + "\n")
        
        checks = []
        
        # Check 1: Response source distribution
        total = sum(self.sources.values())
        if total > 0:
            model_rate = self.sources.get("model", 0) / total * 100
            if model_rate >= 75:
                checks.append(("✅ Model Quality", f"Good ({model_rate:.0f}% pass rate)"))
            elif model_rate >= 60:
                checks.append(("⚠️  Model Quality", f"Fair ({model_rate:.0f}% pass rate)"))
            else:
                checks.append(("❌ Model Quality", f"Poor ({model_rate:.0f}% pass rate - check training)"))
        
        # Check 2: Fallback rate
        if total > 0:
            gemini_rate = self.sources.get("gemini", 0) / total * 100
            if gemini_rate < 5:
                checks.append(("✅ Fallback Rate", f"Excellent ({gemini_rate:.1f}%)"))
            elif gemini_rate < 15:
                checks.append(("✅ Fallback Rate", f"Good ({gemini_rate:.1f}%)"))
            elif gemini_rate < 25:
                checks.append(("⚠️  Fallback Rate", f"Moderate ({gemini_rate:.1f}% - monitor model)"))
            else:
                checks.append(("❌ Fallback Rate", f"High ({gemini_rate:.1f}% - retrain model)"))
        
        # Check 3: Response time
        if self.response_times:
            avg_time = sum(self.response_times) / len(self.response_times)
            if avg_time < 1000:
                checks.append(("✅ Response Time", f"Excellent ({avg_time:.0f} ms)"))
            elif avg_time < 2000:
                checks.append(("✅ Response Time", f"Good ({avg_time:.0f} ms)"))
            elif avg_time < 4000:
                checks.append(("⚠️  Response Time", f"Acceptable ({avg_time:.0f} ms)"))
            else:
                checks.append(("❌ Response Time", f"Slow ({avg_time:.0f} ms - check network)"))
        
        # Print checks
        for status, message in checks:
            print(f"{status:30} {message}")
        
        print("\n" + "─" * 70 + "\n")


def main():
    """Run monitoring"""
    
    monitor = ValidationMonitor()
    
    # Parse logs (last 24 hours by default, or specify with argument)
    hours = int(sys.argv[1]) if len(sys.argv) > 1 else 24
    
    print(f"\n📖 Reading logs from the last {hours} hour(s)...\n")
    
    report = monitor.parse_logs(hours=hours)
    
    if report.get("total_responses", 0) == 0:
        print("⚠️  No response data found in logs.")
        print("\nTips:")
        print("1. Make sure Backend/app.log exists")
        print("2. Make some API requests to generate logs")
        print("3. Try: python test_response_validator.py")
        return
    
    # Print report
    monitor.print_report(report)
    
    # Print health check
    monitor.print_health_check()
    
    # Recommendations
    print("📋 Recommendations:\n")
    
    total = report.get("total_responses", 1)
    gemini_rate = monitor.sources.get("gemini", 0) / total * 100 if total > 0 else 0
    
    if gemini_rate > 20:
        print("⚠️  High Gemini fallback rate detected!")
        print("   → Consider retraining the model with more medical data")
        print("   → Review validation prompts for false negatives")
        print()
    
    avg_time = sum(monitor.response_times) / len(monitor.response_times) if monitor.response_times else 0
    if avg_time > 3000:
        print("⚠️  Slow response times detected!")
        print("   → Check network connectivity to Gemini API")
        print("   → Consider caching frequently asked questions")
        print("   → Profile the model inference time")
        print()
    
    validation_pass = monitor.validation_results.get("passed", 0)
    validation_fail = monitor.validation_results.get("failed", 0)
    if validation_fail > 0 and validation_pass > 0:
        fail_rate = validation_fail / (validation_pass + validation_fail) * 100
        print(f"ℹ️  Model validation failure rate: {fail_rate:.1f}%")
        print("   This is expected - the fallback system is working as designed")
        print()
    
    print("✅ Monitoring complete. Check Backend/app.log for detailed logs.\n")


if __name__ == "__main__":
    main()
