from review_service import normalize_review
from file_parser import combine_materials


def test_normalize_review_fills_missing_fields():
    review = normalize_review({"readiness": "Major revision needed", "issues": []})
    assert review["readiness"] == "Major revision needed"
    assert len(review["issues"]) > 0
    assert len(review["checklist"]) > 0


def test_combine_materials_uses_text_and_extracted_sections():
    material = combine_materials("hello", ["world"])
    assert "hello" in material
    assert "world" in material
