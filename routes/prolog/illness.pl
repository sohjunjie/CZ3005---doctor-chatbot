get_random_illness_symptom(X, Y):-
  random_illness(X),
  random_symptom(X, Y).

random_illness(X):- illness(L), random_member(X,L).
random_symptom(fever, X):- fever(L), random_member(X,L).
random_symptom(cold, X):- cold(L), random_member(X,L).
random_symptom(injury, X):- injury(L), random_member(X,L).
random_symptom(myopia, X):- myopia(L), random_member(X,L).
random_symptom(terminal_illness, X):- terminal_illness(L), random_member(X,L).

illness([fever, cold, injury, myopia, terminal_illness]).
fever([temperature, sweat, ache, hot_forehead, friend_with_fever]).
cold([sneeze, cough, dry_throat, bad_appetite, friend_with_cold]).
injury([cut, lot_of_pain, wound, bad_temper, bruise]).
myopia([sore_eye, blurry_vision, sudden_blindness, slow_vision, bad_vision]).
terminal_illness([muscle_pain, nervous_shock, lung_pain, heart_pain, bone_pain]).

pain_library([unbearable_pain, lot_of_pain, manageable_pain, mild_pain, no_pain]).
mood_library([calm, angry, weepy, stressed, confused]).
