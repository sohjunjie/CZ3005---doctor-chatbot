/**
 * Doctor gestures knowledge base
 * @author soh jun jie
 * @version 1.0
 * @since 2018-3-4
 */

% gesture rules, return X is the instances of the identified gestures
appropriate_gesture(unbearable_pain, calm, X):- polite_gesture(X).
appropriate_gesture(unbearable_pain, angry, X):- calming_gesture(X).
appropriate_gesture(unbearable_pain, weepy, X):- calming_gesture(X).
appropriate_gesture(unbearable_pain, stressed, X):- calming_gesture(X).
appropriate_gesture(unbearable_pain, confused, X):- calming_gesture(X).

appropriate_gesture(lot_of_pain, calm, X):- polite_gesture(X).
appropriate_gesture(lot_of_pain, angry, X):- calming_gesture(X).
appropriate_gesture(lot_of_pain, weepy, X):- normal_gesture(X).
appropriate_gesture(lot_of_pain, stressed, X):- calming_gesture(X).
appropriate_gesture(lot_of_pain, confused, X):- calming_gesture(X).

appropriate_gesture(manageable_pain, calm, X):- normal_gesture(X).
appropriate_gesture(manageable_pain, angry, X):- calming_gesture(X).
appropriate_gesture(manageable_pain, weepy, X):- calming_gesture(X).
appropriate_gesture(manageable_pain, stressed, X):- normal_gesture(X).
appropriate_gesture(manageable_pain, confused, X):- polite_gesture(X).

appropriate_gesture(mild_pain, calm, X):- polite_gesture(X).
appropriate_gesture(mild_pain, angry, X):- polite_gesture(X).
appropriate_gesture(mild_pain, weepy, X):- calming_gesture(X).
appropriate_gesture(mild_pain, stressed, X):- normal_gesture(X).
appropriate_gesture(mild_pain, confused, X):- normal_gesture(X).

appropriate_gesture(no_pain, calm, X):- normal_gesture(X).
appropriate_gesture(no_pain, angry, X):- calming_gesture(X).
appropriate_gesture(no_pain, weepy, X):- normal_gesture(X).
appropriate_gesture(no_pain, stressed, X):- normal_gesture(X).
appropriate_gesture(no_pain, confused, X):- normal_gesture(X).

% default to normal gesture instances if above combination does not satisfy
appropriate_gesture(_, _, X):- normal_gesture(X).

% gestures library containing list of gesture instances
polite_gesture([look_concerned, mellow_voice, light_touch, faint_smile]).
calming_gesture([greet, look_composed, look_attentive]).
normal_gesture([broad_smile, joke, beaming_voice]).
