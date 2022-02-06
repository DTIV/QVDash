---
description: Limitations of Quadratic Voting.
---

# Quadratic Voting

{% hint style="info" %}
Despite being a very efficient, effective, and robust way of voting, Quadratic voting still has some drawbacks when it comes to real-life implementation which makes it vulnerable to cheating and collusion.
{% endhint %}

### Wealth

Wealthy people can afford to buy more votes relative to the rest of the population which could distort the voting outcomes to favor the rich people. This effect is dampened a bit by the fact that it is quadratic voting and the amount of money increases quadratically as we keep buying votes. For example, someone with 16 times more wealth will only have 4 times more effect on the outcome of a certain voting event. Someone with 100 times more wealth will only have 10 times more influence on the outcome, not 100 times, reducing the influence by 90% and this percentage keeps getting better for larger values. This can be further improved by introducing artificial currency which is distributed on a uniform basis, thus giving every individual an equal say, but allowing individuals to more flexibly align their voting behavior with their preferences.

### Fake Identity (Sybil attacks)

Quadratic voting requires a way such that individuals cannot create multiple identities and exploit the quadratic voting by repeatedly paying for a single vote and influencing the decision. This will make the quadratic voting mechanism fail and become linear voting.

### Collusion

The quadratic voting mechanism fails again and falls into the linear voting situation if we cant prevent people from selling their votes. We have technologies like cryptography, encryption, zero-proof knowledge being tested which may be helpful in dealing with this issue.

Follow our handy guides to get started on the basics as quickly as possible:

{% embed url="https://www.youtube.com/watch?v=_xRbnobzs2Y" %}

{% content-ref url="qvdash/smart-contract.md" %}
[smart-contract.md](qvdash/smart-contract.md)
{% endcontent-ref %}

{% content-ref url="qvdash/contract-interaction.md" %}
[contract-interaction.md](qvdash/contract-interaction.md)
{% endcontent-ref %}

{% content-ref url="qvdash/covalent-api.md" %}
[covalent-api.md](qvdash/covalent-api.md)
{% endcontent-ref %}
