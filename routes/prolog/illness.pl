get_random_illness_symptom(X, Y):-
  random_illness(X),
  random_symptom(X, Y).

random_illness(X):- illness(L), random_member(X,L).
random_symptom(fever, X):- fever(L), random_member(X,L).
random_symptom(cold, X):- cold(L), random_member(X,L).
random_symptom(injury, X):- injury(L), random_member(X,L).

random_pain(X):- pain_library(L), member(X, L).

illness([fever, cold, injury]).
fever([temperature, sweat, ache, weepy]).
cold([sneeze, cough, dry_throat, temperature]).
injury([cut, lot_of_pain, wound, bad_temper]).

pain_library([unbearable_pain, lot_of_pain, manageable_pain, mild_pain, no_pain]).
mood_library([calm, angry, weepy, stressed]).
