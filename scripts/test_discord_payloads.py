import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("payloads", Path(__file__).with_name("discord-payloads.py"))
payloads = importlib.util.module_from_spec(spec)
spec.loader.exec_module(payloads)


def item(link="/foundations/basics/unit-01/", title="A program", description="Instructions"):
    return {"link": link, "title": title, "description": description}


class PayloadTests(unittest.TestCase):
    def test_absolute_feed_url_is_not_prefixed_twice(self):
        url = "https://code198x.com/foundations/basics/unit-01/"
        self.assertEqual(payloads.messages([item(url)])[0]["embeds"][0]["url"], url)

    def test_relative_url(self):
        self.assertEqual(payloads.messages([item()])[0]["embeds"][0]["url"],
                         "https://code198x.com/foundations/basics/unit-01/")

    def test_empty_feed_posts_nothing(self):
        self.assertEqual(payloads.messages([]), [])

    def test_ten_embed_boundary(self):
        self.assertEqual([len(p["embeds"]) for p in payloads.messages([item()] * 21)], [10, 10, 1])

    def test_combined_limit_preserves_all_items(self):
        messages = payloads.messages([item(title="T" * 250, description="D" * 600)] * 19)
        self.assertEqual(sum(len(p["embeds"]) for p in messages), 19)
        for message in messages:
            self.assertLessEqual(sum(payloads.size(e["title"]) + payloads.size(e["description"])
                                     for e in message["embeds"]), 6000)

    def test_unicode_limits_and_mentions(self):
        message = payloads.messages([item(title="😀" * 256, description="😀" * 4096)])[0]
        embed = message["embeds"][0]
        self.assertLessEqual(payloads.size(embed["title"]), 250)
        self.assertLessEqual(payloads.size(embed["description"]), 600)
        self.assertEqual(message["allowed_mentions"], {"parse": []})

    def test_foreign_or_malformed_url_fails_before_posting(self):
        for url in ("https://code198x.comhttps://code198x.com/a", "//example.com/a", "javascript:alert(1)"):
            with self.assertRaises(ValueError):
                payloads.messages([item(url)])


if __name__ == "__main__":
    unittest.main()
