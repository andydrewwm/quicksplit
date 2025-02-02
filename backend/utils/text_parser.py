from ..models import Item

def parse_receipt_text(text: str) -> list[Item]:
    lines = text.split("\n")
    items = []
    for line in lines:
        parts = line.rsplit(" ", 1)
        if len(parts) == 2:
            name, price = parts
            try:
                price = float(price.replace("$", ""))
                items.append(Item(name=name.strip(), price=price))
            except ValueError:
                continue
    return items