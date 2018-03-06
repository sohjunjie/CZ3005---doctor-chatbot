/**
 * Doctor illness knowledge base
 * @author soh jun jie
 * @version 1.0
 * @since 2018-3-4
 */

:- ['lib.pl'].

% generate a random illness-symptom pairing
get_random_illness_symptom(X, Y):-
  random_illness(X),
  random_symptom(X, Y).

% pick a random illness instance
random_illness(X):- illness(L), random_member(X,L).
random_symptom(fever, X):- fever(L), random_member(X,L).
random_symptom(cold, X):- cold(L), random_member(X,L).
random_symptom(injury, X):- injury(L), random_member(X,L).
random_symptom(myopia, X):- myopia(L), random_member(X,L).
random_symptom(terminal_illness, X):- terminal_illness(L), random_member(X,L).

% illness library containing list of illness
illness([fever, cold, injury, myopia, terminal_illness]).

% instances of symptom associated with a particular illness
fever([temperature, sweat, ache, hot_forehead, friend_with_fever]).
cold([sneeze, cough, dry_throat, bad_appetite, friend_with_cold]).
injury([cut, lot_of_pain, wound, bad_temper, bruise]).
myopia([sore_eye, blurry_vision, sudden_blindness, slow_vision, bad_vision]).
terminal_illness([muscle_pain, nervous_shock, lung_pain, heart_pain, bone_pain]).

pain_library([unbearable_pain, lot_of_pain, manageable_pain, mild_pain, no_pain]).
mood_library([calm, angry, weepy, stressed, confused]).

% obtain the index of the Illness in the Illness library given a Illness
get_illness_index(Illness, Index):-
  illness(L), indexOf(L, Illness, Index).

% return a List initialised with 0 with length equal to illness library list length
build_illness_list_counter(List)  :-
    illness(M),
      list_length(M, Listlen),          % Obtain Listlen=Total number of illness in library
      length(List, Listlen),            % Create list of length Listlen
      maplist(=(0), List).              % initialise List element as all zero

% given Illness and list=illnessCounterList, increment 1 list element that correspond
% to the given Illness and put the result in Res
increment_illness_counter(List, Illness, Res):-
  get_illness_index(Illness, Index),
    increment_list_at_position(List, Index, Res).

% Given IllnessCounterList, Illness with the highest counter will be return
give_illness_diagnosis(IllnessCounterList, Illness):-
  max_list(IllnessCounterList, M, I),   % obtain I=index with highest counter, M=number of counter
    illness(IllnessList),
    M > 0,
    nth0(I, IllnessList, Illness);      % Illness is returned
  Illness = no_illness.                 % M<=0, no illness at all
