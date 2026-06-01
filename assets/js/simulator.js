  var SIMULATOR_CONFIG = window.MONAIDE_SIMULATOR_CONFIG || {};
  var questionIndexByStep = { 1: 0, 2: 0, 3: 0, 4: 0 };
  var simulatorTrackingStarted = false;
  var simulatorResultsShown = false;
  var simulatorAbandonTracked = false;
  var simulatorLastCompletedStep = 0;
  var simulatorLastCompletedBlock = 0;
  var SIMULATOR_BLOCK_HINTS = {
    1: [
      'Deux repères suffisent pour commencer. Si tu hésites, choisis l’option la plus proche.',
      'Ces réponses aident à éviter de proposer une démarche qui ne te concerne pas.'
    ],
    2: [
      'On regarde ici ce qui peut changer les aides possibles: travail, logement, enfants ou formation.',
      'Réponds seulement si la question apparaît. Le simulateur adapte la suite.'
    ],
    3: [
      'Commence par une fourchette de revenu. Le but est d’orienter, pas de calculer un droit officiel.',
      'Pour l’épargne et la prime maladie, une estimation suffit. Tu peux choisir “Je ne sais pas”.',
      'Dernier point: dis seulement si une aide est déjà ouverte, pour éviter les doublons.'
    ],
    4: [
      'Derniers points utiles: santé, dettes ou situation familiale sensible peuvent changer la bonne porte.',
      'Encore une petite étape, puis tu verras les pistes et les prochaines actions.'
    ]
  };
  var questionSetsByStep = SIMULATOR_CONFIG.questionSetsByStep || {
    1: [['commune', 'age'], ['situation_familiale', 'statut_sejour', 'besoin_protection']],
    2: [['situation_pro', 'logement', 'enfants'], ['loyer', 'en_formation']],
    3: [['revenu'], ['fortune', 'prime_lamal'], ['aides_actuelles']],
    4: [['incapacite', 'dettes'], ['separation_en_cours'], ['proche_aidant']]
  };

  function trackSimulatorEvent(name, params) {
    if (!window.trackMonaideEvent) return;
    window.trackMonaideEvent(name, params || {});
  }

  function trackSimulatorStart(source) {
    if (simulatorTrackingStarted) return;
    simulatorTrackingStarted = true;
    trackSimulatorEvent('simulator_start', {
      source: source || 'questionnaire'
    });
  }

  function trackSimulatorStep(step, source) {
    if (!simulatorTrackingStarted) return;
    trackSimulatorEvent('simulator_step_view', {
      step: step,
      block: (questionIndexByStep[step] || 0) + 1,
      source: source || 'navigation'
    });
  }

  function trackSimulatorStepComplete(step, block, source) {
    if (!simulatorTrackingStarted) return;
    simulatorLastCompletedStep = step;
    simulatorLastCompletedBlock = block || ((questionIndexByStep[step] || 0) + 1);
    trackSimulatorEvent('simulator_step_complete', {
      step: step,
      block: simulatorLastCompletedBlock,
      source: source || 'navigation'
    });
  }

  function trackSimulatorAbandon() {
    if (!simulatorTrackingStarted || simulatorResultsShown || simulatorAbandonTracked) return;
    simulatorAbandonTracked = true;
    trackSimulatorEvent('simulator_abandon', {
      step: currentStep || 1,
      block: (questionIndexByStep[currentStep] || 0) + 1,
      last_completed_step: simulatorLastCompletedStep,
      last_completed_block: simulatorLastCompletedBlock
    });
  }

  function selectedValue(name, fallback) {
    var checked = document.querySelector('input.choice-input[name="' + name + '"]:checked');
    if (checked) return checked.value;
    var select = document.getElementById(name);
    if (select && select.value) return select.value;
    return fallback || '';
  }

  function setRadioValue(name, value) {
    var changed = false;
    document.querySelectorAll('input.choice-input[name="' + name + '"]').forEach(function(input) {
      input.checked = input.value === value;
      if (input.checked) changed = true;
    });
    var select = document.getElementById(name);
    if (select) select.value = changed ? value : '';
  }

  function clearRadioValue(name) {
    document.querySelectorAll('input.choice-input[name="' + name + '"]').forEach(function(input) {
      input.checked = false;
    });
    var select = document.getElementById(name);
    if (select) select.value = '';
  }

  function isStudentSituation(value) {
    return String(value || '').indexOf('tudiant') !== -1 || String(value || '').indexOf('apprentissage') !== -1;
  }

  function setChoiceOptionVisibility(name, value, visible) {
    document.querySelectorAll('input.choice-input[name="' + name + '"][value="' + value + '"]').forEach(function(input) {
      var label = input.closest('label');
      if (label) {
        label.hidden = !visible;
        label.style.display = visible ? '' : 'none';
      }
    });
    var select = document.getElementById(name);
    if (!select) return;
    Array.from(select.options).forEach(function(option) {
      if (option.value === value) option.hidden = !visible;
    });
  }

  function syncFormationQuestionMode() {
    var sitPro = selectedValue('situation_pro', '');
    var group = document.getElementById('group-formation');
    if (!group) return;
    var label = group.querySelector('.form-label');
    var helper = group.querySelector('.form-help');
    var student = isStudentSituation(sitPro);

    setChoiceOptionVisibility('en_formation', 'non', !student);

    if (student) {
      if (label) label.textContent = 'Quel type de formation ?';
      if (helper) {
        helper.textContent = '';
        helper.hidden = true;
      }
      if (selectedValue('en_formation', '') === 'non') clearRadioValue('en_formation');
    } else {
      if (label) label.textContent = 'Es-tu en formation ?';
      if (helper) {
        helper.textContent = '';
        helper.hidden = true;
      }
    }
  }

  function toggleConditionalBlock(id, show, resetName, resetValue) {
    var el = document.getElementById(id);
    if (!el) return;
    el.hidden = !show;
    if (!show && resetName) {
      if (typeof resetValue === 'string') setRadioValue(resetName, resetValue);
      else clearRadioValue(resetName);
    }
  }

  function syncStatutSejourField() {
    var base = selectedValue('statut_sejour_base', '');
    var detailWrap = document.getElementById('group-statut-permis');
    var detailSelect = document.getElementById('statut_permis_detail');
    var targetSelect = document.getElementById('statut_sejour');
    if (!targetSelect) return;

    if (detailWrap) detailWrap.hidden = base !== 'permis';

    if (base === 'suisse') {
      targetSelect.value = 'Nationalité suisse';
      if (detailSelect) detailSelect.value = '';
    } else if (base === 'autre') {
      targetSelect.value = 'Autre / sans statut régulier';
      if (detailSelect) detailSelect.value = '';
    } else if (base === 'permis') {
      targetSelect.value = detailSelect ? detailSelect.value : '';
    } else {
      targetSelect.value = '';
      if (detailSelect) detailSelect.value = '';
    }
  }

  function syncAidesActuellesField(changedInput) {
    var base = selectedValue('aides_actuelles_base', '');
    var checkboxes = Array.from(document.querySelectorAll('input.choice-input[name="aides_actuelles_multi"]'));
    var hiddenField = document.getElementById('aides_actuelles');
    var detailWrap = document.getElementById('group-aides-actuelles-detail');
    if (!checkboxes.length || !hiddenField) return;

    if (detailWrap) detailWrap.hidden = base !== 'oui';

    if (base !== 'oui') {
      checkboxes.forEach(function(input) {
        input.checked = false;
      });
      hiddenField.value = 'aucune';
      return;
    }

    if (changedInput) {
      checkboxes.forEach(function(input) {
        if (input.value === changedInput.value) input.checked = changedInput.checked;
      });
    }

    var selected = checkboxes.filter(function(input) { return input.checked; }).map(function(input) { return input.value; });
    if (!selected.length) {
      hiddenField.value = '';
      return;
    }

    hiddenField.value = selected.join(',');
  }

  function syncLogementField() {
    var base = selectedValue('logement_base', '');
    var detailWrap = document.getElementById('group-logement-detail');
    var detailSelect = document.getElementById('logement_detail');
    var targetSelect = document.getElementById('logement');
    if (!targetSelect) return;

    if (detailWrap) detailWrap.hidden = !base;

    if (!base) {
      targetSelect.value = '';
      if (detailSelect) detailSelect.value = '';
      return;
    }

    if (detailSelect) {
      var allowed = {
        'avec_cout': ['Locataire (appartement ou maison)', 'Propriétaire'],
        'heberge': ['Chez mes parents (sans loyer)', 'Hébergé·e chez un proche'],
        'instable': ['Sans logement fixe / à la rue', 'Foyer / structure d’accueil']
      };
      var validOptions = allowed[base] || [];
      Array.from(detailSelect.options).forEach(function(option) {
        if (!option.value) {
          option.hidden = false;
          return;
        }
        option.hidden = validOptions.indexOf(option.value) === -1;
      });
      if (validOptions.indexOf(detailSelect.value) === -1) detailSelect.value = '';
      targetSelect.value = detailSelect.value || '';
    }
  }

  function updateConditionalQuestions() {
    var age = selectedValue('age', '');
    var famille = selectedValue('situation_familiale', '');
    var sitPro = selectedValue('situation_pro', '');
    var logement = selectedValue('logement', '');

    var retraite = sitPro.indexOf('Retrait') !== -1 || age === '65plus';
    var situationEtudiante = isStudentSituation(sitPro);
    var jeuneOuFormation = age === 'moins18' || age === '18-25' || age === '26-35' || situationEtudiante;
    var familleAvecEnfants = famille.indexOf('enfants') !== -1 || famille.indexOf('Parent seul') !== -1;
    var logementAvecCout = logement.indexOf('Locataire') !== -1 || logement.indexOf('Propri') !== -1;

    toggleConditionalBlock('group-enfants', !famille || familleAvecEnfants || famille === 'Autre', 'enfants', familleAvecEnfants ? null : 'non');
    toggleConditionalBlock('group-formation', !retraite && (!sitPro || jeuneOuFormation), 'en_formation', 'non');
    syncFormationQuestionMode();
    toggleConditionalBlock('group-loyer', logementAvecCout, 'loyer');
  }

  function normalizeSimulatorIntroCopy() {
    var stepOne = document.getElementById('step1');
    if (!stepOne) return;
    var title = stepOne.querySelector('.step-title');
    var subtitle = stepOne.querySelector('.step-subtitle');
    if (title) title.textContent = 'Quelques infos utiles';
    if (subtitle) subtitle.textContent = SIMULATOR_BLOCK_HINTS[1][0];
  }

  // ─── Navigation ──────────────────────────────────────────────────────────
  window.navVers = function(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  window.navVersDoc = function(id) {
    ['doc-ri','doc-lamal','doc-ai','doc-bourse','doc-carte'].forEach(function(docId) {
      var e = document.getElementById(docId);
      var ic = document.getElementById(docId + '-icon');
      if (e) e.style.display = 'none';
      if (ic) ic.style.transform = '';
    });
    var el = document.getElementById(id);
    var icon = document.getElementById(id + '-icon');
    if (el) el.style.display = 'block';
    if (icon) icon.style.transform = 'rotate(180deg)';
    var section = document.getElementById('formulaires');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ─── Accordéons documentation ────────────────────────────────────────────
  function updateDocAccordionState(id, open) {
    var el = document.getElementById(id);
    var icon = document.getElementById(id + '-icon');
    if (!el) return;
    var shell = el.closest('.doc-accordion-shell');
    var button = shell ? shell.querySelector('.doc-accordion-btn') : null;
    el.style.display = open ? 'block' : 'none';
    el.classList.toggle('is-open', open);
    el.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (shell) shell.classList.toggle('is-open', open);
    if (button) button.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (icon) icon.style.transform = open ? 'rotate(180deg)' : '';
  }

  window.toggleAccordion = function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var open = el.style.display === 'block';
    updateDocAccordionState(id, !open);
  }

  window.ouvrirAccordion = function(id) {
    updateDocAccordionState(id, true);
  }

  window.openDocumentationTarget = function(anchorId, accordionId) {
    var documentationItem = (window.getDocumentationStoreItem && (window.getDocumentationStoreItem(anchorId) || window.getDocumentationStoreItem(accordionId))) || null;
    var resolvedAnchorId = documentationItem ? documentationItem.id : anchorId;
    var resolvedAccordionId = documentationItem ? documentationItem.accordionId : accordionId;
    var anchor = document.getElementById(resolvedAnchorId);
    updateDocAccordionState(resolvedAccordionId, true);
    if (!anchor) return;
    window.requestAnimationFrame(function() {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  window.openDocumentationForAid = function(idOrTitle) {
    var target = window.getDocumentationTargetForAid ? window.getDocumentationTargetForAid(idOrTitle) : null;
    if (!target) return;
    window.openDocumentationTarget(target.blockId, target.accordionId);
  }

  // ─── Simulateur : navigation ─────────────────────────────────────────────

  function getStepElement(step) {
    return document.getElementById('step' + step);
  }

  function getStepQuestionGroups(step) {
    var stepEl = getStepElement(step);
    if (!stepEl) return [];
    return Array.from(stepEl.querySelectorAll('.form-group')).filter(function(group) {
      return !group.hidden;
    });
  }

  function getVisibleStepQuestionSets(step) {
    var groups = getStepQuestionGroups(step);
    var groupMap = {};
    groups.forEach(function(group) {
      var fieldId = getGroupFieldId(group);
      if (fieldId) groupMap[fieldId] = group;
    });
    var rawSets = questionSetsByStep[step] || [];
    var visibleSets = rawSets.map(function(fieldIds) {
      return fieldIds.map(function(fieldId) { return groupMap[fieldId]; }).filter(Boolean);
    }).filter(function(set) { return set.length; });
    var groupedFields = new Set();
    visibleSets.forEach(function(set) {
      set.forEach(function(group) {
        groupedFields.add(getGroupFieldId(group));
      });
    });
    groups.forEach(function(group) {
      var fieldId = getGroupFieldId(group);
      if (fieldId && !groupedFields.has(fieldId)) visibleSets.push([group]);
    });
    return visibleSets;
  }

  function getGroupFieldId(group) {
    if (!group) return '';
    var directInput = group.querySelector('.form-input[id], .form-select[id], select[id], textarea[id], input[type="hidden"][id]');
    if (directInput && directInput.id) return directInput.id;
    var radio = group.querySelector('input.choice-input[name]');
    return radio ? radio.name : '';
  }

  function ensureStepQuestionUi(step) {
    return;
  }

  function getRequiredFieldsForCurrentStep(step) {
    var fields = ((SIMULATOR_CONFIG.requiredFieldsForCurrentStep && SIMULATOR_CONFIG.requiredFieldsForCurrentStep[step]) || []).slice();
    if (step === 2 && isStudentSituation(selectedValue('situation_pro', '')) && fields.indexOf('en_formation') === -1) {
      fields.push('en_formation');
    }
    return fields;
  }

  function updateRequiredMarkers(step) {
    var requiredFields = getRequiredFieldsForCurrentStep(step);
    var stepEl = getStepElement(step);
    if (!stepEl) return;
    Array.from(stepEl.querySelectorAll('.form-group')).forEach(function(group) {
      var label = group.querySelector('.form-label');
      if (!label) return;
      var fieldId = getGroupFieldId(group);
      label.classList.toggle('is-required', requiredFields.indexOf(fieldId) !== -1);
    });
  }

  function ensureQuickReviewButton(stepEl) {
    if (!stepEl) return null;
    var actionBar = stepEl.querySelector('.step-actions');
    if (!actionBar) return null;
    var button = actionBar.querySelector('.btn-quick-review');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn-nav btn-quick-review';
      button.textContent = 'Réévaluer mes résultats';
      button.onclick = function() {
        reEvaluateSimulationFromEdit();
      };
      var nextBtn = actionBar.querySelector('.btn-next');
      if (nextBtn) actionBar.insertBefore(button, nextBtn);
      else actionBar.appendChild(button);
    }
    return button;
  }

  function playChoiceFeedback(input) {
    if (!input || !input.parentElement) return;
    var card = input.parentElement.querySelector('.choice-card');
    if (!card) return;
    card.classList.remove('just-selected');
    void card.offsetWidth;
    card.classList.add('just-selected');
    window.setTimeout(function() {
      card.classList.remove('just-selected');
    }, 420);
  }

  function renderStepQuestionMode(step) {
    var stepEl = getStepElement(step);
    if (!stepEl) return;
    ensureStepQuestionUi(step);
    updateRequiredMarkers(step);
    var quickReviewBtn = ensureQuickReviewButton(stepEl);
    var groups = getStepQuestionGroups(step);
    var sets = getVisibleStepQuestionSets(step);
    if (!groups.length) return;
    var maxIndex = sets.length - 1;
    if (sets.length && questionIndexByStep[step] > maxIndex) questionIndexByStep[step] = maxIndex;
    if (questionIndexByStep[step] < 0) questionIndexByStep[step] = 0;

    groups.forEach(function(group) {
      group.style.display = 'none';
      group.classList.remove('is-question-current');
      var wrapper = group.parentElement;
      if (wrapper && wrapper.classList.contains('step-question-set')) wrapper.classList.remove('is-visible');
    });

    sets.forEach(function(set, index) {
      var wrapper = set[0].parentElement;
      if (!wrapper || !wrapper.classList.contains('step-question-set')) return;
      var active = index === questionIndexByStep[step];
      wrapper.classList.toggle('is-visible', active);
      set.forEach(function(group) {
        group.style.display = '';
      });
    });

    if (!sets.length || !stepEl.querySelector('.step-question-set.is-visible')) {
      groups.forEach(function(group) {
        group.style.display = '';
      });
      stepEl.querySelectorAll('.step-question-set').forEach(function(wrapper) {
        wrapper.classList.add('is-visible');
      });
    }

    var progress = stepEl.querySelector('.step-question-progress');
    if (progress) progress.textContent = sets.length ? ('Bloc ' + (questionIndexByStep[step] + 1) + ' sur ' + sets.length) : '';
    var subtitle = stepEl.querySelector('.step-subtitle');
    var hints = SIMULATOR_BLOCK_HINTS[step] || [];
    if (subtitle && hints.length) subtitle.textContent = hints[questionIndexByStep[step]] || hints[0] || '';

    var prevBtn = stepEl.querySelector('.step-actions .btn-prev');
    var nextBtn = stepEl.querySelector('.step-actions .btn-next');
    if (prevBtn) prevBtn.style.visibility = (step === 1 && questionIndexByStep[step] === 0) ? 'hidden' : 'visible';
    if (quickReviewBtn) quickReviewBtn.style.display = quickReviewMode ? 'inline-flex' : 'none';
    if (nextBtn) {
      if (step === TOTAL_STEPS && (!sets.length || questionIndexByStep[step] === maxIndex)) nextBtn.innerHTML = 'Voir mes r&#233;sultats';
      else if (sets.length && questionIndexByStep[step] < maxIndex) nextBtn.innerHTML = 'Continuer &#8594;';
      else nextBtn.innerHTML = 'Continuer &#8594;';
    }
  }

  function validateCurrentQuestion(step) {
    var sets = getVisibleStepQuestionSets(step);
    var currentSet = sets[questionIndexByStep[step]] || [];
    var requiredFields = getStepRequiredFields(step + 1);
    var invalidGroup = null;
    var allValid = true;
    currentSet.forEach(function(group) {
      var fieldId = getGroupFieldId(group);
      if (!fieldId) return;
      var required = requiredFields.indexOf(fieldId) !== -1;
      if (!required) {
        setFieldValidity(fieldId, true);
        return;
      }
      var valid = !!getFieldValue(fieldId);
      setFieldValidity(fieldId, valid);
      if (!valid && !invalidGroup) invalidGroup = group;
      if (!valid) allValid = false;
    });
    if (invalidGroup) guideInvalidGroup(invalidGroup);
    if (invalidGroup) {
      trackSimulatorEvent('simulator_validation_error', {
        step: step,
        block: (questionIndexByStep[step] || 0) + 1,
        field: getGroupFieldId(invalidGroup) || 'unknown'
      });
    }
    return allValid;
  }

  function moveToNextQuestionOrStep(targetStep) {
    updateConditionalQuestions();
    var step = currentStep;
    var sets = getVisibleStepQuestionSets(step);
    if (!sets.length) {
      goToStep(targetStep, true);
      return;
    }
    if (!validateCurrentQuestion(step)) return;
    if (questionIndexByStep[step] < sets.length - 1) {
      trackSimulatorStepComplete(step, questionIndexByStep[step] + 1, 'next_block');
      questionIndexByStep[step] += 1;
      renderStepQuestionMode(step);
      trackSimulatorStep(step, 'next_block');
      var simulatorBody = document.getElementById('simulator-body');
      if (simulatorBody) simulatorBody.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (!validateStepBefore(targetStep)) return;
    trackSimulatorStepComplete(step, questionIndexByStep[step] + 1, 'step_complete');
    questionIndexByStep[targetStep] = 0;
    goToStep(targetStep, true);
  }

  function moveToPreviousQuestionOrStep(targetStep) {
    updateConditionalQuestions();
    var step = currentStep;
    if (questionIndexByStep[step] > 0) {
      questionIndexByStep[step] -= 1;
      renderStepQuestionMode(step);
      trackSimulatorStep(step, 'previous_block');
      var simulatorBody = document.getElementById('simulator-body');
      if (simulatorBody) simulatorBody.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    questionIndexByStep[targetStep] = Math.max(getVisibleStepQuestionSets(targetStep).length - 1, 0);
    goToStep(targetStep, true);
  }

  window.goToStep = function(step, force) {
    updateConditionalQuestions();
    if (!force && step < currentStep) {
      moveToPreviousQuestionOrStep(step);
      return;
    }
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var el = document.getElementById('step' + i);
      if (el) {
        el.style.display = (i === step) ? 'block' : 'none';
        el.classList.toggle('is-active-step', i === step);
      }
    }
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var dot = document.getElementById('dot' + i);
      if (!dot) continue;
      dot.classList.remove('active', 'done');
      if (i < step) dot.classList.add('done');
      if (i === step) dot.classList.add('active');
    }
    currentStep = step;
    renderStepQuestionMode(step);
    trackSimulatorStep(step, 'step_change');
    var simulator = document.getElementById('simulateur');
    if (simulator) simulator.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function getStepRequiredFields(step) {
    var fields = ((SIMULATOR_CONFIG.requiredFieldsBeforeStep && SIMULATOR_CONFIG.requiredFieldsBeforeStep[step]) || []).slice();
    if (step === 3 && isStudentSituation(selectedValue('situation_pro', '')) && fields.indexOf('en_formation') === -1) {
      fields.push('en_formation');
    }
    return fields;
  }

  function getFieldValue(fieldId) {
    var input = document.getElementById(fieldId);
    if (input && input.tagName === 'INPUT' && input.type !== 'hidden') {
      return (input.value || '').trim();
    }
    return selectedValue(fieldId, '');
  }

  function getFieldDisplayValue(fieldId) {
    if (fieldId === 'commune') return getFieldValue('commune') || '';

    if (fieldId === 'aides_actuelles') {
      var selectedAides = Array.from(document.querySelectorAll('input.choice-input[name="aides_actuelles_multi"]:checked')).map(function(input) {
        var title = input.parentElement && input.parentElement.querySelector('.choice-title');
        return title ? title.textContent.trim() : input.value;
      });
      return selectedAides.join(', ');
    }

    var select = document.getElementById(fieldId);
    if (select && select.tagName === 'SELECT' && select.value) {
      var option = select.options[select.selectedIndex];
      if (option && option.textContent) return option.textContent.trim();
    }

    var checked = document.querySelector('input.choice-input[name="' + fieldId + '"]:checked');
    if (checked) {
      var checkedTitle = checked.parentElement && checked.parentElement.querySelector('.choice-title');
      if (checkedTitle) return checkedTitle.textContent.trim();
      return checked.value || '';
    }

    return getFieldValue(fieldId);
  }

  function getStepForField(fieldId) {
    if (['commune', 'age', 'situation_familiale', 'statut_sejour', 'besoin_protection'].indexOf(fieldId) !== -1) return 1;
    if (['situation_pro', 'logement', 'enfants', 'loyer', 'en_formation'].indexOf(fieldId) !== -1) return 2;
    if (['revenu', 'fortune', 'prime_lamal', 'aides_actuelles'].indexOf(fieldId) !== -1) return 3;
    if (['incapacite', 'dettes', 'separation_en_cours', 'proche_aidant'].indexOf(fieldId) !== -1) return 4;
    return 1;
  }

  function getQuestionIndexForField(step, fieldId) {
    updateConditionalQuestions();
    var visibleSets = getVisibleStepQuestionSets(step);
    var matchedIndex = visibleSets.findIndex(function(set) {
      return set.some(function(group) {
        return getGroupFieldId(group) === fieldId;
      });
    });
    return matchedIndex >= 0 ? matchedIndex : 0;
  }

  function renderResultsProfileSummary(data) {
    var container = document.getElementById('results-profile-summary');
    if (!container) return;
    var communeValue = String(data.commune || '').trim();
    if (!communeValue || communeValue.toLowerCase() === 'non précisé') communeValue = '';

    var items = [
      { label: 'Commune', value: communeValue, field: 'commune' },
      { label: 'Âge', value: data.age || '', field: 'age' },
      { label: 'Situation familiale', value: data.famille || '', field: 'situation_familiale' },
      { label: 'Statut en Suisse', value: data.statut || '', field: 'statut_sejour' },
      { label: 'Situation pro', value: data.travail || '', field: 'situation_pro' },
      { label: 'Logement', value: data.logement || '', field: 'logement' },
      { label: 'Revenu', value: data.revenu || '', field: 'revenu' },
      { label: 'Épargne', value: data.fortune || '', field: 'fortune' }
    ].filter(function(item) {
      return !!item.value;
    });

    if (String(data.separation || '').trim()) items.push({ label: 'Séparation', value: data.separation, field: 'separation_en_cours' });
    if (String(data.protection || '').trim()) items.push({ label: 'Protection', value: data.protection, field: 'besoin_protection' });
    if (String(data.procheAidant || '').trim()) items.push({ label: 'Proche aidé', value: data.procheAidant, field: 'proche_aidant' });
    if (!items.length) {
      container.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    container.innerHTML = '<div class="results-profile-top"><div><div class="results-profile-title">Récapitulatif</div>'
      + '<div class="results-profile-text">Tes réponses prises en compte.</div></div>'
      + '<button type="button" class="results-profile-edit" onclick="editSimulationAnswers()">Modifier mes réponses</button></div>'
      + '<div class="results-profile-grid">'
      + items.map(function(item) {
          return '<button type="button" class="results-profile-item is-editable" onclick="editSimulationField(\'' + escapeHtml(item.field) + '\')"><span class="results-profile-label">' + escapeHtml(item.label) + '</span><span class="results-profile-value">' + escapeHtml(item.value) + '</span></button>';
        }).join('')
      + '</div>';
    container.style.display = 'block';
  }

  function resetResultsNote() {
    var note = document.getElementById('results-note');
    if (!note) return;
    note.classList.remove('is-dismissed');
    note.style.display = 'block';
    note.setAttribute('aria-hidden', 'false');
  }

  window.closeResultsNote = function() {
    var note = document.getElementById('results-note');
    if (!note) return;
    note.classList.add('is-dismissed');
    note.setAttribute('aria-hidden', 'true');
  }

  function revealResultsPane() {
    var results = document.getElementById('results');
    var simulator = document.getElementById('simulateur');
    var list = document.getElementById('results-list');
    if (!results) return;
    results.style.display = 'block';
    if (simulator) simulator.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.requestAnimationFrame(function() {
      results.focus({ preventScroll: true });
      if (list) list.setAttribute('aria-busy', 'false');
    });
  }

  function setFieldValidity(fieldId, valid) {
    var input = document.getElementById(fieldId);
    var group = input ? input.closest('.form-group') : null;
    if (!group) return;
    group.classList.toggle('invalid', !valid);
    group.classList.remove('is-guided-error');
    input.setAttribute('aria-invalid', valid ? 'false' : 'true');
    var error = group.querySelector('.form-error');
    if (error) {
      error.style.display = valid ? 'none' : 'block';
      if (valid) error.removeAttribute('role');
      else error.setAttribute('role', 'alert');
    }
    var helper = group.querySelector('.form-error-helper');
    var suppressGuidedError = fieldId === 'en_formation' && isStudentSituation(selectedValue('situation_pro', ''));
    if (!valid && !helper && !suppressGuidedError) {
      helper = document.createElement('div');
      helper.className = 'form-error-helper';
      helper.textContent = 'Réponds juste à cette question pour continuer. Tu peux choisir l’option la plus proche, même si ce n’est pas parfait.';
      if (error) error.insertAdjacentElement('afterend', helper);
      else group.appendChild(helper);
    }
    if (helper) helper.style.display = valid ? 'none' : 'block';
  }

  function focusInvalidGroup(group) {
    if (!group) return;
    var target = group.querySelector('.form-select:not([hidden]), .form-input:not([hidden]), textarea') || group.querySelector('.choice-card');
    if (!target) return;
    if (!target.hasAttribute('tabindex') && target.classList && target.classList.contains('choice-card')) {
      target.setAttribute('tabindex', '-1');
    }
    window.setTimeout(function() {
      try {
        target.focus({ preventScroll: true });
      } catch (error) {
        target.focus();
      }
    }, 260);
  }

  function guideInvalidGroup(group) {
    if (!group) return;
    group.classList.add('is-guided-error');
    group.scrollIntoView({ behavior: 'smooth', block: 'center' });
    focusInvalidGroup(group);
  }

  function validateStepBefore(targetStep) {
    var requiredFields = getStepRequiredFields(targetStep);
    var invalidFieldId = '';
    requiredFields.forEach(function(fieldId) {
      var valid = !!getFieldValue(fieldId);
      setFieldValidity(fieldId, valid);
      if (!valid && !invalidFieldId) invalidFieldId = fieldId;
    });
    if (invalidFieldId) {
      var firstInvalid = document.getElementById(invalidFieldId);
      if (firstInvalid) {
        var group = firstInvalid.closest('.form-group');
        if (group) guideInvalidGroup(group);
      }
      trackSimulatorEvent('simulator_validation_error', {
        step: targetStep - 1,
        block: (questionIndexByStep[targetStep - 1] || 0) + 1,
        field: invalidFieldId
      });
      return false;
    }
    return true;
  }

  function getAllRequiredFieldIds() {
    var fields = (SIMULATOR_CONFIG.allRequiredFieldIds || ['age', 'situation_familiale', 'statut_sejour', 'situation_pro', 'logement', 'revenu', 'fortune', 'prime_lamal']).slice();
    if (isStudentSituation(selectedValue('situation_pro', '')) && fields.indexOf('en_formation') === -1) {
      fields.push('en_formation');
    }
    return fields;
  }

  function validateAllSimulationFields() {
    updateConditionalQuestions();
    var invalidFieldId = '';
    getAllRequiredFieldIds().forEach(function(fieldId) {
      var valid = !!getFieldValue(fieldId);
      setFieldValidity(fieldId, valid);
      if (!valid && !invalidFieldId) invalidFieldId = fieldId;
    });
    if (!invalidFieldId) return true;
    var step = getStepForField(invalidFieldId);
    trackSimulatorEvent('simulator_validation_error', {
      step: step,
      block: (questionIndexByStep[step] || 0) + 1,
      field: invalidFieldId
    });
    questionIndexByStep[step] = getQuestionIndexForField(step, invalidFieldId);
    goToStep(step, true);
    var firstInvalid = document.getElementById(invalidFieldId);
    if (firstInvalid) {
      var group = firstInvalid.closest('.form-group');
      if (group) guideInvalidGroup(group);
    }
    return false;
  }

  window.editSimulationAnswers = function() {
    quickReviewMode = true;
    trackSimulatorEvent('simulator_edit_answers', {
      source: 'results_summary'
    });
    var results = document.getElementById('results');
    if (results) results.style.display = 'none';
    questionIndexByStep[1] = 0;
    goToStep(1, true);
  }

  window.editSimulationField = function(fieldId) {
    var step = getStepForField(fieldId);
    quickReviewMode = true;
    trackSimulatorEvent('simulator_edit_field', {
      step: step,
      field: fieldId
    });
    var results = document.getElementById('results');
    if (results) results.style.display = 'none';
    questionIndexByStep[step] = getQuestionIndexForField(step, fieldId);
    goToStep(step, true);
  }

  window.reEvaluateSimulationFromEdit = function() {
    if (!validateAllSimulationFields()) return;
    analyserSituation();
  }

  window.goToStepValidated = function(step) {
    moveToNextQuestionOrStep(step);
  }

  window.goToResultsValidated = function() {
    updateConditionalQuestions();
    var sets = getVisibleStepQuestionSets(TOTAL_STEPS);
    if (sets.length && questionIndexByStep[TOTAL_STEPS] < sets.length - 1) {
      if (!validateCurrentQuestion(TOTAL_STEPS)) return;
      trackSimulatorStepComplete(TOTAL_STEPS, questionIndexByStep[TOTAL_STEPS] + 1, 'next_block');
      questionIndexByStep[TOTAL_STEPS] += 1;
      renderStepQuestionMode(TOTAL_STEPS);
      trackSimulatorStep(TOTAL_STEPS, 'next_block');
      var simulatorBody = document.getElementById('simulator-body');
      if (simulatorBody) simulatorBody.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (!validateCurrentQuestion(TOTAL_STEPS)) return;
    trackSimulatorStepComplete(TOTAL_STEPS, questionIndexByStep[TOTAL_STEPS] + 1, 'submit');
    if (window.trackMonaideEvent) {
      window.trackMonaideEvent('simulator_submit', {
        source: 'questionnaire'
      });
    }
    simulatorResultsShown = true;
    analyserSituation();
  }

  window.restart = function() {
    trackSimulatorEvent('simulator_restart', {
      source: 'results'
    });
    simulatorTrackingStarted = false;
    simulatorResultsShown = false;
    simulatorAbandonTracked = false;
    simulatorLastCompletedStep = 0;
    simulatorLastCompletedBlock = 0;
    quickReviewMode = false;
    document.querySelectorAll('input.choice-input[type="radio"]').forEach(function(input) {
      input.checked = input.hasAttribute('checked');
    });
    document.querySelectorAll('input.choice-input[type="checkbox"]').forEach(function(input) {
      input.checked = input.hasAttribute('checked');
    });
    document.querySelectorAll('select.form-select[hidden]').forEach(function(select) {
      var checked = document.querySelector('input.choice-input[name="' + select.id + '"]:checked');
      select.value = checked ? checked.value : '';
    });
    var communeInput = document.getElementById('commune');
    if (communeInput) communeInput.value = '';
    var statutPermisDetail = document.getElementById('statut_permis_detail');
    if (statutPermisDetail) statutPermisDetail.value = '';
    var logementDetail = document.getElementById('logement_detail');
    if (logementDetail) logementDetail.value = '';
    clearRadioValue('aides_actuelles_base');
    syncStatutSejourField();
    syncAidesActuellesField();
    clearRadioValue('logement_base');
    syncLogementField();
    updateConditionalQuestions();
    document.getElementById('results').style.display = 'none';
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var el = document.getElementById('step' + i);
      if (el) el.style.display = i === 1 ? 'block' : 'none';
      questionIndexByStep[i] = 0;
    }
    currentStep = 1;
    latestSimulation = null;
    document.querySelectorAll('.form-group.invalid').forEach(function(group) {
      group.classList.remove('invalid');
      var error = group.querySelector('.form-error');
      if (error) error.style.display = 'none';
    });
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var dot = document.getElementById('dot' + i);
      if (dot) { dot.classList.remove('active','done'); if (i === 1) dot.classList.add('active'); }
    }
    renderStepQuestionMode(1);
    var simulator = document.getElementById('simulateur');
    if (simulator) simulator.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  window.addEventListener('pagehide', trackSimulatorAbandon);

  document.addEventListener('DOMContentLoaded', function() {
    for (var step = 1; step <= TOTAL_STEPS; step++) {
      var stepEl = getStepElement(step);
      if (!stepEl) continue;
      var actionBar = stepEl.querySelector('.step-actions');
      if (!actionBar) continue;
      var groups = Array.from(stepEl.querySelectorAll('.form-group'));
      if (!groups.length) continue;
      var currentSet = null;
      groups.forEach(function(group) {
        var fieldId = getGroupFieldId(group);
        var stepSets = questionSetsByStep[step] || [];
        var setExists = stepSets.some(function(set) { return set.indexOf(fieldId) !== -1; });
        if (!setExists) {
          currentSet = null;
          return;
        }
        var shouldStartNew = !currentSet || currentSet.getAttribute('data-set-fields').split(',').indexOf(fieldId) === -1;
        if (shouldStartNew) {
          var matchingSet = stepSets.find(function(set) { return set.indexOf(fieldId) !== -1; });
          currentSet = document.createElement('div');
          currentSet.className = 'step-question-set';
          currentSet.setAttribute('data-set-fields', matchingSet.join(','));
          stepEl.insertBefore(currentSet, actionBar);
        }
        currentSet.appendChild(group);
      });
    }
    document.querySelectorAll('input.choice-input[type="radio"]').forEach(function(input) {
      input.addEventListener('change', function() {
        trackSimulatorStart('choice');
        playChoiceFeedback(this);
        var select = document.getElementById(this.name);
        if (select) select.value = this.value;
        if (this.name === 'statut_sejour_base') syncStatutSejourField();
        if (this.name === 'logement_base') syncLogementField();
        if (this.name === 'aides_actuelles_base') syncAidesActuellesField();
        setFieldValidity(this.name, true);
        setFieldValidity('statut_sejour', !!getFieldValue('statut_sejour'));
        setFieldValidity('logement', !!getFieldValue('logement'));
        setFieldValidity('aides_actuelles', true);
        updateConditionalQuestions();
        renderStepQuestionMode(currentStep);
      });
    });
    document.querySelectorAll('input.choice-input[type="checkbox"][name="aides_actuelles_multi"]').forEach(function(input) {
      input.addEventListener('change', function() {
        trackSimulatorStart('choice');
        playChoiceFeedback(this);
        syncAidesActuellesField(this);
        renderStepQuestionMode(currentStep);
      });
    });
    var statutPermisDetail = document.getElementById('statut_permis_detail');
    if (statutPermisDetail) {
      statutPermisDetail.addEventListener('change', function() {
        trackSimulatorStart('detail_select');
        syncStatutSejourField();
        setFieldValidity('statut_sejour', !!getFieldValue('statut_sejour'));
      });
    }
    var logementDetail = document.getElementById('logement_detail');
    if (logementDetail) {
      logementDetail.addEventListener('change', function() {
        trackSimulatorStart('detail_select');
        syncLogementField();
        setFieldValidity('logement', !!getFieldValue('logement'));
        updateConditionalQuestions();
        renderStepQuestionMode(currentStep);
      });
    }
    document.querySelectorAll('.form-input').forEach(function(input) {
      input.addEventListener('input', function() {
        trackSimulatorStart('text_input');
        if ((this.value || '').trim()) setFieldValidity(this.id, true);
      });
    });
    document.querySelectorAll('select.form-select[hidden]').forEach(function(select) {
      if (!select.id) return;
      var checked = document.querySelector('input.choice-input[name="' + select.id + '"]:checked');
      if (checked) {
        select.value = checked.value;
      }
    });
    normalizeSimulatorIntroCopy();
    syncStatutSejourField();
    syncAidesActuellesField();
    syncLogementField();
    updateConditionalQuestions();
    renderStepQuestionMode(currentStep);
  });

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
