## Forgiving Equations
---
> I) Percentage Remebered R(t) = 100 / (e^(kt))

k is coeff of Forgiving

t is time in days

---

How many reviews alredy made more, more time is needed to forget

Using Personal and Arbitrary Patterns of review: [15, 25, 35, 65, 80]

Index Represents how many reviews alredy Made (x)

Value at Index represents the time until last review needing for forgetting everything until 1% of Memory

I Modelled A Linear Function Using least squares and obtained following eq:

> II) Days Until Forgiving d(x) = 17x- 7

---

To Determine How many days (t) are needed to forget (until y%) using specific k we use following functions

> III) t(k) = log_e(100/y) / k

as we consider Forgiving, 1% of memory, so y = 1

> IV) t(k) = log_e(100/1) / k

The same functions is used for calculating the k needed to the memory be forgot in t days:

> V) k(t) = log_e(100/1) / t

---

To Define The k used after each revision we made: II) + V)

> VI) k(d(x))