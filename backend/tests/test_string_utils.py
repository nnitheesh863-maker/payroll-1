from app.core.string_utils import slugify, mask_sensitive

def test_slugify():
    assert slugify("John Doe - Software Engineer") == "john-doe-software-engineer"
    assert slugify("Special @#$% Characters!") == "special-characters"

def test_mask_sensitive():
    assert mask_sensitive("1234567890", visible_tail=4) == "******7890"
    assert mask_sensitive("123", visible_tail=4) == "123"
