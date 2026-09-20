"""
Application version and release metadata.
"""
__version__ = "0.9.0"
__build__ = "2026.09.21"
__author__ = "PeoplePay360 Team"

def get_version_info():
    return {
        "version": __version__,
        "build": __build__,
        "author": __author__
    }
