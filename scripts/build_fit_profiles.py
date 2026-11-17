import ast
import json
import math
from collections import defaultdict
from pathlib import Path

from datasets import load_dataset


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src" / "lib" / "job-fit-profiles.json"
MIN_BUCKET_SAMPLES = 5


def parse_skill_list(value, field_name):
    if isinstance(value, list):
        skills = value
    elif isinstance(value, str):
        skills = ast.literal_eval(value)
    else:
        raise ValueError(f"Unexpected {field_name} value: {type(value).__name__}")

    if not isinstance(skills, list) or not all(isinstance(skill, str) for skill in skills):
        raise ValueError(f"Expected {field_name} to be a list of strings")
    return [skill.strip() for skill in skills if skill.strip()]


def normalize_skill(skill):
    return " ".join(
        "".join(character.lower() if character.isalnum() else " " for character in skill).split()
    )


def rounded(value):
    return round(value, 2)


def main():
    dataset = load_dataset("batuhanmtl/job_resume_fit", streaming=True)
    rows = dataset["train"]
    profiles = defaultdict(lambda: {"required_skills": set(), "buckets": defaultdict(list), "rows": 0})

    for row in rows:
        category = row["category"].strip()
        required_skills = parse_skill_list(row["job_required_skills"], "job_required_skills")
        resume_skills = {
            normalize_skill(skill)
            for skill in parse_skill_list(row["resume_skill_list"], "resume_skill_list")
        }
        required_keys = {normalize_skill(skill) for skill in required_skills}
        score = float(row["ai_match_score"])

        if not category or not math.isfinite(score):
            continue

        profile = profiles[category]
        profile["rows"] += 1
        profile["required_skills"].update(required_skills)
        coverage = len(required_keys & resume_skills) / len(required_keys) if required_keys else 0
        bucket_index = min(int(coverage * 10), 9)
        profile["buckets"][bucket_index].append((coverage, score))

    result = {
        "source": "batuhanmtl/job_resume_fit",
        "datasetRows": sum(profile["rows"] for profile in profiles.values()),
        "profiles": {},
    }

    for category, profile in sorted(profiles.items()):
        score_points = []
        for bucket_index, values in sorted(profile["buckets"].items()):
            if len(values) < MIN_BUCKET_SAMPLES:
                continue
            score_points.append(
                {
                    "coverage": rounded(sum(coverage for coverage, _ in values) / len(values)),
                    "score": rounded(sum(score for _, score in values) / len(values)),
                    "samples": len(values),
                }
            )
        result["profiles"][category] = {
            "requiredSkills": sorted(profile["required_skills"]),
            "samples": profile["rows"],
            "scorePoints": score_points,
        }

    OUTPUT.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(profiles)} role profiles from {result['datasetRows']} dataset rows to {OUTPUT}")


if __name__ == "__main__":
    main()
